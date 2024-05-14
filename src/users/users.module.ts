import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Class } from './entities/class.entity';
import { Document } from './entities/document.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User,Document,Class])],
  exports: [UsersService, TypeOrmModule]
})
export class UsersModule {}
