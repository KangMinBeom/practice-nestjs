import { Module } from '@nestjs/common';
import { AccessLog, AccessToken, RefreshToken, User } from './entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AccessLogRepository,
  AccessTokenRepository,
  RefreshTokenRepository,
  UserRepository,
} from './repository';
import { AuthService, UserService } from './service';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy';

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
