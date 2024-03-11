import {
  BaseEntity,
  Column,
  OneToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Relation,
} from 'typeorm';

import { IssuedCoupon } from './issued-coupon.entity';

type CouponType = 'percent' | 'fixed';

@Entity()
export class Coupon extends BaseEntity {
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

  @Column({ type: 'varchar', length: 50 })
  type: CouponType;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  value: number;

  @OneToMany(() => IssuedCoupon, (issuedCoupon) => issuedCoupon.coupon)
  issuedCoupons: Relation<IssuedCoupon[]>;
}

function Entity(): (target: typeof Coupon) => void | typeof Coupon {
  throw new Error('Function not implemented.');
}
