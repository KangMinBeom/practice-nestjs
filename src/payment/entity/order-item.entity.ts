import {
  Column,
  Entity,
  ManyToOne,
  Relation,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Order } from './order.entity';

@Entity()
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  @ManyToOne(() => Order, (order) => order.items)
  order: Relation<Order>;

  @Column()
  productId: string;

  @Column()
  quantity: number;
}
