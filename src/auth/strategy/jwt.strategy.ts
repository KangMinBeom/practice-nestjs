import { Injectable, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../service/user.service';
import { UserRepository } from '../repository/user.repository';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../types';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from '~/src/exception/BusinessException';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: TokenPayload): Promise<User> {
    const { sub, jti } = payload;
    return this.userService.validateUser(sub, jti);
  }

  async existenceUser(payload: TokenPayload): Promise<User> {
    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new BusinessException(
        'auth',
        'Not-Found user',
        'Not-Found user',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }
}
