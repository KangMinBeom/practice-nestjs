import { HttpStatus, Injectable } from '@nestjs/common';
import { Order } from '../entity/order.entity';
import { OrderItem } from '../entity/order-item.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { BusinessException } from '../../exception/BusinessException';
import { ProductService } from './product.service';
import { IssuedCouponRepository } from '../repository/issued-coupon.repository';
import { OrderRepository } from '../repository/order.repository';
import { PointRepository } from '../repository/point.repository';
import { ShippingInfoRepository } from '../repository/shipping-info.repository';
import { Transactional } from 'typeorm-transactional';
import { ConfigService } from '@nestjs/config';
import { PaymentsRepository } from '../repository/payments.repository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly issuedCouponRepository: IssuedCouponRepository,
    private readonly pointRepository: PointRepository,
    private readonly productService: ProductService,
    private readonly shippingInfoRepository: ShippingInfoRepository,
    private readonly orderRepository: OrderRepository,
    private readonly configService: ConfigService,
    private readonly paymentsRepository: PaymentsRepository,
  ) {}

  @Transactional()
  async initOrder(dto: CreateOrderDto): Promise<Order> {
    const finalAmount = await this.calculateFianlAmount(dto);

    // 주문 생성
    return this.createOrder(
      dto.userId,
      dto.orderItems,
      finalAmount,
      dto.shippingAddress,
    );
  }

  @Transactional()
  async completeOrder(orderId: string): Promise<Order> {
    return this.orderRepository.completeOrder(orderId);
  }

  async confirmPayment(payments: any): Promise<any> {
    const { paymentKey, orderId, amount, orderNo } = payments.body;

    const secretKey = this.configService.get<string>('SecretKey');
    const encryptedSecretKey =
      'Basic ' + Buffer.from(secretKey + ':').toString('base64');

    try {
      const response = await fetch(
        'https://api.tosspayments.com/v1/payments/confirm',
        {
          method: 'POST',
          body: JSON.stringify({ orderId, amount, paymentKey }),
          headers: {
            Authorization: encryptedSecretKey,
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.json();
      console.log(data);
      return this.paymentsRepository.savePayments(
        paymentKey,
        orderId,
        amount,
        orderNo,
      );
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw new BusinessException(
        'payment',
        `Error confirming payment: ${error}`,
        'Error confirming payment: ${error}',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async createOrder(
    userId: string,
    orderItems: OrderItem[],
    finalAmount: number,
    shippingAddress?: string,
  ): Promise<Order> {
    const shippingInfo = shippingAddress
      ? await this.shippingInfoRepository.createShippingInfo(shippingAddress)
      : null;
    return await this.orderRepository.createOrder(
      userId,
      orderItems,
      finalAmount,
      shippingInfo,
    );
  }

  private async calculateFianlAmount(dto: CreateOrderDto): Promise<number> {
    const totalAmount = await this.calculateTotalAmount(dto.orderItems);
    return this.applyDiscounts(
      totalAmount,
      dto.userId,
      dto.couponId,
      dto.pointAmountToUse,
    );
  }

  private async calculateTotalAmount(orderItems: OrderItem[]): Promise<number> {
    let totalAmount = 0;

    const productIds = orderItems.map((item) => item.productId);
    const products = await this.productService.getProductsByIds(productIds);
    for (const item of orderItems) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new BusinessException(
          'payment',
          `Product with ID ${item.productId} not found`,
          'Invalid product',
          HttpStatus.BAD_REQUEST,
        );
      }
      totalAmount += product.price * item.quantity;
    }

    return totalAmount;
  }

  private async applyDiscounts(
    totalAmount: number,
    userId: string,
    couponId?: string,
    pointAmountToUse?: number,
  ): Promise<number> {
    const couponDiscount = couponId
      ? await this.applyCoupon(couponId, userId, totalAmount)
      : 0;
    const pointDiscount = pointAmountToUse
      ? await this.applyPoints(pointAmountToUse, userId)
      : 0;

    // 최종 금액 계산
    const finalAmount = totalAmount - (couponDiscount + pointDiscount);
    return finalAmount < 0 ? 0 : finalAmount;
  }

  private async applyCoupon(
    couponId: string,
    userId: string,
    totalAmount: number,
  ): Promise<number> {
    const issuedCoupon = await this.issuedCouponRepository.findOne({
      where: {
        coupon: { id: couponId },
        user: { id: userId },
      },
    });

    if (!issuedCoupon) {
      throw new BusinessException(
        'payment',
        `user doesn't have coupon. couponId: ${couponId} userId: ${userId}`,
        'Invalid coupon',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValid =
      issuedCoupon?.isValid &&
      issuedCoupon?.validFrom <= new Date() &&
      issuedCoupon?.validUntil > new Date();
    if (!isValid) {
      throw new BusinessException(
        'payment',
        `Invalid coupon type. couponId: ${couponId} userId: ${userId}`,
        'Invalid coupon',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { coupon } = issuedCoupon;
    if (coupon.type === 'percent') {
      return (totalAmount * coupon.value) / 100;
    } else if (coupon.type === 'fixed') {
      return coupon.value;
    }
    return 0;
  }

  private async applyPoints(
    pointAmountToUse: number,
    userId: string,
  ): Promise<number> {
    const point = await this.pointRepository.findOne({
      where: { user: { id: userId } },
    });
    if (point.availableAmount < 0 || point.availableAmount < pointAmountToUse) {
      throw new BusinessException(
        'payment',
        `Invalid points amount ${point.availableAmount}`,
        'Invalid points',
        HttpStatus.BAD_REQUEST,
      );
    }

    return pointAmountToUse;
  }
}
