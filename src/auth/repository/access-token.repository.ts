import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AccessToken } from '../entity/access-token.entity';
import { User } from '../entity/user.entity';

@Injectable()
export class AccessTokenRepository extends Repository<AccessToken> {
  constructor(
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(
      accessTokenRepository.target,
      accessTokenRepository.manager,
      accessTokenRepository.queryRunner,
    );
  }

  async saveAccessToken(
    jti: string,
    user: User,
    token: string,
    expiresAt: Date,
  ): Promise<AccessToken> {
    const accessToken = new AccessToken();
    accessToken.user = user;
    accessToken.jti = jti;
    accessToken.token = token;
    accessToken.expiresAt = expiresAt;
    accessToken.isRevoked = false;
    return this.save(accessToken);
  }
}
