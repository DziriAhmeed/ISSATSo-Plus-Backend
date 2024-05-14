import { AuthModule } from './auth/auth.module';
import { PasswordModule } from './password/password.module';
import bcryptConfig from './config/bcrypt.config';
import jwtConfig from './config/jwt.config';
import { User } from './users/entities/user.entity';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsersModule , TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'issatso+',
    synchronize: true,
    autoLoadEntities: true,
  }),
  ConfigModule.forRoot({
    isGlobal: true,
    load: [bcryptConfig, jwtConfig],
  }),
  AuthModule,
    UsersModule,
    PasswordModule,
  
],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  },
],
})
export class AppModule {}
