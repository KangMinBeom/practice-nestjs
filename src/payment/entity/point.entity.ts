import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Relation,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

import { PointLog } from './point-log.entity';

import { User } from '../../auth/entity/user.entity';

@Entity()
export class Point extends BaseEntity {
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

  @OneToOne(() => User, (user) => user.point)
  @JoinColumn()
  user: Relation<User>;

  @Column({ type: 'int' })
  availableAmount: number;

  @OneToMany(() => PointLog, (pointLog) => pointLog.amount)
  logs: Relation<PointLog[]>;

  use(amountToUse: number) {
    this.availableAmount -= amountToUse;
  }
}
