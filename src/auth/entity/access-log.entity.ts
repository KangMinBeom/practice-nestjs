import {
  Column,
  Entity,
  ManyToOne,
  Relation,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class AccessLog extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  ua: string;

  @Column()
  endpoint: string;

  @Column()
  ip: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  accessedAt: Date;

  @ManyToOne(() => User, (user) => user.accessLogs, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  user?: Relation<User>;
}
