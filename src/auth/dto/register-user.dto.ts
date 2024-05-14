import { IsAlpha, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsAlpha()
  firstName: string;

  @IsAlpha()
  lastName: string;
}