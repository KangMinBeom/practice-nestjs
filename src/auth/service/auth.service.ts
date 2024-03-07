import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { User } from '../entity/user.entity';
import { RequestInfo, TokenPayload } from '../types/index';
import { v4 as uuidv4 } from 'uuid';
import { AccessTokenRepository } from '../repository/access-token.repository';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class authService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accessTokenRepository: AccessTokenRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  //   async login(email: string, password: string, req: RequestInfo){

  //   };

  //   private async validateUser{
  //     email: string,
  //     password: string,
  //     }: Promise<User>{
  //         const user = this.userRepository.findOne({email});
  //         if( user && (await bcrypt.compare(password, user.password))){

  //         }
  //     }

  createTokenPayload(userId: string): TokenPayload {
    return {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      jti: uuidv4(),
    };
  }
  async createAccessToken(user: User, payload: TokenPayload): Promise<string> {
    const expiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRY');
    const token = this.jwtService.sign(payload, { expiresIn });
    const expiresAt = this.calculateExpiry(expiresIn);

    await this.accessTokenRepository.saveAccessToken(
      payload.jti,
      user,
      token,
      expiresAt,
    );

    return token;
  }

  private calculateExpiry(expiry: string): Date {
    let expiresInMilliseconds = 0;

    if (expiry.endsWith('d')) {
      const days = parseInt(expiry.slice(0, -1), 10);
      expiresInMilliseconds = days * 24 * 60 * 60 * 1000;
    } else if (expiry.endsWith('h')) {
      const hours = parseInt(expiry.slice(0, -1), 10);
      expiresInMilliseconds = hours * 60 * 60 * 1000;
    } else if (expiry.endsWith('m')) {
      const minutes = parseInt(expiry.slice(0, -1), 10);
      expiresInMilliseconds = minutes * 60 * 1000;
    } else if (expiry.endsWith('s')) {
      const seconds = parseInt(expiry.slice(0, -1), 10);
      expiresInMilliseconds = seconds * 1000;
    } else {
      throw new BusinessException(
        'auth',
        'invalid-expiry',
        'Invalid expiry time',
        HttpStatus.BAD_REQUEST,
      );
    }
    return new Date(Date.now() + expiresInMilliseconds);
  }
}
