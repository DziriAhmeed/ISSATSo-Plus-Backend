import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BcryptConfig } from 'src/config/config.interfaces';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private bcryptConfig: BcryptConfig;

  constructor(private readonly configService: ConfigService) {
    this.bcryptConfig = this.configService.get<BcryptConfig>('bcrypt');
  }
  /**
   * async hashPassword - Hashes the given password using bcrypt.
   *
   * @param {string} password - The password to be hashed
   * @return {Promise<string>} The hashed password
   */
  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = this.bcryptConfig.saltOrRounds;
    return await bcrypt.hash(password, saltOrRounds);
  }

  /**
   * Compares a plain text password with a hashed password.
   *
   * @param {string} plainTextPassword - The plain text password to compare.
   * @param {string} hashedPassword - The hashed password to compare against.
   * @return {Promise<boolean>} Returns a Promise that resolves to a boolean indicating whether the passwords match.
   */
  async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}