import { Body, Controller, Post } from '@nestjs/common';
import { SignUpRequestDto } from '../dto/signup-req.dto';
import { SignUpResponseDto } from '../dto/signup-res.dto';
import { UserService } from '../service/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(
    @Body() signupRequestDto: SignUpRequestDto,
  ): Promise<SignUpResponseDto> {
    const user = await this.userService.signup(signupRequestDto);
    return {
      email: user.email,
      password: user.password,
      username: user.username,
      phone: user.phone,
    };
  }
}
