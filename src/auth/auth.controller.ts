import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginUserDto } from './dto/login.dto';
import { LoginService } from './login.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly authService: AuthService,
  ) {}
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.loginService.login(loginUserDto);
  }

  @Post('/register')
  async register(@Body() registerUserDto: CreateUserDto) {
    return await this.authService.register(registerUserDto);
  }
}