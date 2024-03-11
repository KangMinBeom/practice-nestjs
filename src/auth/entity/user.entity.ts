import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { AccessToken } from './access-token.entity';
import { AccessLog } from './access-log.entity';
import { Point } from '../../payment/entity/point.entity';
import { Order } from '../../payment/entity/order.entity';

// export type UserRole = 'admin | user';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column()
  phone: string;

  @OneToMany(() => AccessLog, (log) => log.user)
  accessLogs: Relation<AccessLog[]>;

  @OneToMany(() => AccessToken, (token) => token.user)
  accessToken: Relation<AccessToken[]>;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshToken: Relation<RefreshToken[]>;

  @OneToMany(() => Point, (point) => point.user)
  point: Relation<Point>;

  @OneToMany(() => Order, (order) => order.user)
  orders: Relation<Order>;
}
