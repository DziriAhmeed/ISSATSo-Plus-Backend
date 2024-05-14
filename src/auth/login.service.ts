import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { UsersService } from '../users/users.service';
  import { PasswordService } from '../password/password.service';
  import { JwtPayload } from './dto/jwt.dto';
  import { LoginUserDto } from './dto/login.dto';
  @Injectable()
  export class LoginService {
    constructor(
      private readonly jwtService: JwtService,
      private readonly usersService: UsersService,
      private readonly passwordService: PasswordService,
    ) {}
  
    async login(loginUserDto: LoginUserDto) {
      const { email, password } = loginUserDto;
  
      // Find user by email
      const user = await this.usersService.findUserByEmail(email);
      // If user not found or password doesn't match, throw UnauthorizedException
      if (!user) throw new NotFoundException('User not found');
      if (
        !(await this.passwordService.comparePasswords(password, user.password))
      ) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return {
        accessToken: await this.generateAccessToken({
          sub: user.userId,
          email: user.email,
          role: user.userRole,
          fullName: user.fullName,
          profilePictureUrl: user.profilePictureUrl,
        }),
      };
    }
  
    async generateAccessToken(payload: JwtPayload): Promise<string> {
      return this.jwtService.signAsync(payload);
    }
  }