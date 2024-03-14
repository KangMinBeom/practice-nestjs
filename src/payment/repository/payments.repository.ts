import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Payments } from '../entity/payments.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from './order.repository';
import { BusinessException } from '~/src/exception/BusinessException';

@Injectable()
export class PaymentsRepository extends Repository<Payments> {
  constructor(
    @InjectRepository(Payments)
    private readonly repo: Repository<Payments>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly orderRepository: OrderRepository,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async savePayments(
    paymentKey: string,
    orderId: string,
    amount: number,
    orderNo: string,
  ): Promise<Payments> {
    const order = await this.orderRepository.findOne({
      where: { orderNo: orderNo },
    });
    if (!order) {
      throw new BusinessException(
        'payment',
        'Not Found ${orderNo}',
        'Not Found ${orderNo}',
        HttpStatus.NOT_FOUND,
      );
    }
    const payments = new Payments();
    payments.order = order;
    payments.paymentKey = paymentKey;
    payments.orderId = orderId;
    payments.amount = amount;
    return this.save(payments);
  }
}
