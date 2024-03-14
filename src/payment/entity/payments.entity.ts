import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Payments {
  @PrimaryGeneratedColumn()
  paymentId: number;

  @Column()
  paymentKey: string;

  @Column()
  amount: number;

  @Column()
  orderId: string;

  @Column({ type: 'timestamp', nullable: true })
  paymentedAt: Date;

  @OneToOne(() => Order, { nullable: true })
  @JoinColumn()
  order: Order;
}
