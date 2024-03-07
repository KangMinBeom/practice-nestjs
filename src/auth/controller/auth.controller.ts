import { Body, Controller, Post } from '@nestjs/common';
import { SignUpRequestDto } from '../dto/signup-req.dto';
import { SignUpResponseDto } from '../dto/signup-res.dto';
import { UserService } from '../service/user.service';
import { RefreshRequestDto } from '../dto/refresh-req.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

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

  @Post('signin')
  async signin(
    @Req() req,
    @Body() signinRequestDto: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    const { ip, method, originalUrl } = req;
    const reqInfo = {
      ip,
      endpoint: `${method} ${originalUrl}`,
      ua: req.headers['user-agent'] || '',
    };

    return this.authService.login(
      signinRequestDto.email,
      signinRequestDto.password,
      reqInfo,
    );

  @Post('refresh')
  async refresh(@Body() dto: RefreshRequestDto): Promise<string> {
    return this.authService.refreshAccessToken(dto.refreshToken);
  }
}
