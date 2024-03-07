import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './service/user.service';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [UserService, UserRepository, AuthService],
  exports: [UserService, UserRepository, AuthService],
})
export class AuthModule {}
