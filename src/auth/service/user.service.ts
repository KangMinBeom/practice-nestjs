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

@Injectable()
@UseFilters(new HttpExceptionFilter())
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
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
}
