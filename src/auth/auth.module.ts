import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PasswordModule } from 'src/password/password.module';
import { LoginService } from './login.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LoginService, JwtStrategy],
  imports: [
    UsersModule,
    PasswordModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        console.log(configService.get<string>('jwt.secret'));
        return {
          secret: 'secret',
          signOptions: {
            expiresIn: '604800s',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}