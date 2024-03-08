import { Module } from '@nestjs/common';
import { AccessLog } from './entity/access-log.entity';
import { AccessToken } from './entity/access-token.entity';
import { RefreshToken } from './entity/refresh-token.entity';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { AccessLogRepository } from './repository/access-log.repository';
import { AccessTokenRepository } from './repository/access-token.repository';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { AuthService } from './service/auth.service';
import { UserService } from './service/user.service';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRY'),
        },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User, AccessToken, RefreshToken, AccessLog]),
  ],
  controllers: [AuthController],
  providers: [
    UserService,
    AuthService,

    UserRepository,
    AccessTokenRepository,
    RefreshTokenRepository,
    AccessLogRepository,

    JwtStrategy,
  ],
  exports: [
    UserService,
    AuthService,

    UserRepository,
    AccessTokenRepository,
    RefreshTokenRepository,
    AccessLogRepository,

    JwtStrategy,
  ],
})
export class AuthModule {}
