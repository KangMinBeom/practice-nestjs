import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { AccessLog } from '../entity/access-log.entity';
import { User } from '../entity/user.entity';

@Injectable()
export class AccessLogRepository extends Repository<AccessLog> {
  constructor(
    @InjectRepository(AccessLog)
    private readonly repo: Repository<AccessLog>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async createAccessLog(user: User, ua: string, endpoint: string, ip: string) {
    const accessLog = new AccessLog();
    accessLog.user = user;
    accessLog.ua = ua;
    accessLog.endpoint = endpoint;
    accessLog.ip = ip;
    accessLog.accessedAt = new Date(Date.now());
    await this.save(accessLog);
  }
}
