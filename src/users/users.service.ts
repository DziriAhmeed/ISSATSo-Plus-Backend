import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { Document } from './entities/document.entity';
import { Role } from './entities/role.enum';

@Injectable()
export class UsersService {
  supabase = createClient(
    this.configService.get('SUPABASE_URL'),
    this.configService.get('SUPABASE_KEY'),
  );
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (await this.findUserByIdentityNumber(createUserDto.identityNumber)) {
      throw new ConflictException('identity number already used');
    }
    if (!createUserDto.email.match(/^[a-zA-Z0-9._%+-]+@issatso\.u-sousse\.tn$/))
      throw new UnauthorizedException('email not valid');

    if (await this.findUserByEmail(createUserDto.email)) {
      throw new ConflictException('email already used');
    }
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const fullName = (
      createUserDto.firstName +
      ' ' +
      createUserDto.lastName
    ).trim();
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      fullName,
      classId: 1,
    });
    return await this.userRepository.save(newUser);
  }

  async findAll(classId: string) {
    // const users = await this.userRepository.find({
    //   relations: ['class']
    // });
    // return users.filter((user) => user.class.className.includes(classname));
    const users = await this.userRepository.find({
      where: {
        classId: +classId,
      },
    });
    console.log(users);
    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userRepository.preload({
      userId: id,
      ...updateUserDto,
    });
    if (!updatedUser) {
      throw new ConflictException('user not found');
    }
    return await this.userRepository.save(updatedUser);
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findUserByIdentityNumber(identityNumber: string) {
    return this.userRepository.findOneBy({ identityNumber });
  }

  async findOneById(id: number) {
    return await this.userRepository.findOneBy({ userId: id });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }
  async comparePlainPasswordToHash(
    plain: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plain, hash);
  }

  async uploadFile(file: Express.Multer.File) {
    const { data, error } = await this.supabase.storage
      .from('ISSATSO+')
      .upload(`documents/${file.originalname}`, file.buffer, {
        upsert: true,
      });
    if (error) {
      console.log(error);
      throw new ConflictException('upload failed');
    }
    const path = `documents/${file.originalname}`;
    const url = this.supabase.storage.from('ISSATSO+').getPublicUrl(path)
      .data.publicUrl;
    const newDocument = this.documentRepository.create({
      documentName: file.originalname,
      documentUrl: url,
      teacherId: 1,
      classId: 2,
    });
    return await this.documentRepository.save(newDocument);
  }
}
