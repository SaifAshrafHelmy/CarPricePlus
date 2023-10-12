import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email already use
    const users = await this.usersService.findAllByEmail(email);
    if (users.length) {
      throw new BadRequestException('email already used in another account.');
    }
    // hash the password
    // generate a salt
    const salt = randomBytes(8).toString('hex');
    // hash the password and the salt together
    const hash = (await scryptAsync(password, salt, 32)) as Buffer;
    // join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    // create the new user and save it
    const user = await this.usersService.create(email, result);
    // return the new user
    return user;
  }

  async signin(email: string, password: string) {
    // See if an account with this email exists
    const [user] = await this.usersService.findAllByEmail(email);
    if (!user) {
      throw new BadRequestException(
        'This email is not associated with any account.',
      );
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scryptAsync(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Wrong password');
    }

    return user;
  }
}
