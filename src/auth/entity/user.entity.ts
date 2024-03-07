import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

// export type UserRole = 'admin | user';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column()
  phone: string;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshToken: Relation<RefreshToken[]>;
}
