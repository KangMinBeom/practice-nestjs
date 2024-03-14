import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class PaymentInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paymentKey: string;

  @Column()
  orderId: string;

  @Column()
  amount: number;

  @OneToOne(() => Order, { nullable: true })
  @JoinColumn()
  order: Order;
}
