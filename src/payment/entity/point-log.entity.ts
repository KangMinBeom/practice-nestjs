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

import { Point } from './point.entity';

export type PointLogType = 'earn' | 'spend';

@Entity()
export class PointLog extends BaseEntity {
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
  @ManyToOne(() => Point, (point) => point.logs)
  point: Relation<Point>;

  @Column({ type: 'int', default: 0 })
  amount: number; // 개별 적립 또는 사용 금액

  @Column({ type: 'text' })
  reason: string; // 개별 적립 또는 사용 사유

  @Column({ type: 'varchar', length: 50 })
  type: PointLogType;

  use(amount: number, reason: string): void {
    this.amount = amount;
    this.reason = reason;
    this.type = 'spend';
  }

  add(amount: number, reason: string): void {
    this.amount = amount;
    this.reason = reason;
    this.type = 'earn';
  }
}
