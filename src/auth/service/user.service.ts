import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UseFilters,
} from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { SignUpRequestDto } from '../dto/signup-req.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../entity/user.entity';
import { HttpExceptionFilter } from 'src/exception/http-Exception.filter';
import { AccessTokenRepository } from '../repository/access-token.repository';

@Injectable()
@UseFilters(new HttpExceptionFilter())
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accessTokenRepository: AccessTokenRepository,
  ) {}
  async signup(signupRequestDto: SignUpRequestDto): Promise<User> {
    const user = this.userRepository.findByEmail(signupRequestDto.email);

    if (await user) {
      throw new ForbiddenException();
    }

    if (signupRequestDto.password !== signupRequestDto.checkpassword) {
      throw new BadRequestException();
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(signupRequestDto.password, salt);

    return this.userRepository.signup(signupRequestDto, hashedPassword);
  }

  async validateUser(id: string, jti: string): Promise<User> {
    const [user, token] = await Promise.all([
      this.userRepository.findOneBy({ id }),
      this.accessTokenRepository.findOneByJti(jti),
    ]);
    if (!user) {
      this.logger.error(`user ${id} not found`);
      throw new BusinessException(
        'user',
        `user not found`,
        `user not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!token) {
      this.logger.error(`jti ${jti} token is revoked`);
      throw new BusinessException(
        'user',
        `revoked token`,
        `revoked token`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }
}
