import { registerAs } from '@nestjs/config';

export default registerAs('bcrypt', () => ({
  saltOrRounds: Number(process.env.BCRYPT_ROUNDS_OR_SALT),
}));