import { IsString } from 'class-validator';

export class SignInRequestDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
