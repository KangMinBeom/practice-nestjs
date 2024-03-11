import {
  BaseEntity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  Entity,
  Relation,
} from 'typeorm';

import { Coupon } from './coupon.entity';

import { User } from '../../auth/entity/user.entity';

import { Order } from './order.entity';

@Entity()
export class IssuedCoupon extends BaseEntity {
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

  @ManyToOne(() => User)
  @JoinColumn()
  user: Relation<User>;

  @ManyToOne(() => Coupon)
  @JoinColumn()
  coupon: Relation<Coupon>;

  @OneToOne(() => Order, (order) => order.usedIssuedCoupon, { nullable: true })
  usedOrder: Relation<Order>;

  @Column({ type: 'boolean', default: false })
  isValid: boolean;

  @Column({ type: 'timestamp', nullable: false })
  validFrom: Date;

  @Column({ type: 'timestamp', nullable: false })
  validUntil: Date;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  usedAt: Date;

  use() {
    this.isUsed = true;
    this.isValid = false;
    this.usedAt = new Date();
  }
}
