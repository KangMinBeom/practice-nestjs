import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entity/coupon.entity';
import { IssuedCoupon } from './entity/issued-coupon.entity';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { Payments } from './entity/payments.entity';
import { Point } from './entity/point.entity';
import { PointLog } from './entity/point-log.entity';
import { Product } from './entity/product.entity';
import { ShippingInfo } from './entity/shipping-info.entity';
import { AuthModule } from '../auth/auth.module';
import { PaymentService } from './service/payment.service';
import { ProductService } from './service/product.service';
import { CouponRepository } from './Repository/coupon.repository';
import { IssuedCouponRepository } from './Repository/issued-coupon.repository';
import { OrderItemRepository } from './Repository/order-item.repository';
import { OrderRepository } from './Repository/order.repository';
import { PointLogRepository } from './Repository/point-log.repository';
import { PointRepository } from './Repository/point.repository';
import { ProductRepository } from './Repository/product.repository';
import { ShippingInfoRepository } from './Repository/shipping-info.repository';
import { PaymentController } from './controller/payment.controller';
import { PaymentsRepository } from './repository/payments.repository';
@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      ShippingInfo,
      Point,
      PointLog,
      Coupon,
      IssuedCoupon,
      Product,
      Payments,
    ]),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    ProductService,
    OrderRepository,
    OrderItemRepository,
    ShippingInfoRepository,
    ProductRepository,
    CouponRepository,
    IssuedCouponRepository,
    PointRepository,
    PointLogRepository,
    PaymentsRepository,
  ],
})
export class PaymentModule {}
