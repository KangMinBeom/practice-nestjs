import { IsString } from 'class-validator';

export class SignUpRequestDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  checkpassword: string;

  @IsString()
  username: string;

  @IsString()
  phone: string;
}
