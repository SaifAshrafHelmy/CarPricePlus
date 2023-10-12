import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string) {
    const newUser = this.repo.create({ email, password });
    return await this.repo.save(newUser);
  }

  // login(email: string, password: string) {}

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('Invalid id.');
    }
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('No users found with this id.');
    }
    return user;
  }

  async findAllByEmail(email: string) {
    const users = await this.repo.findBy({ email });
    // if (!users || !users.length) {
    //   throw new NotFoundException('No users found matching this email.');
    // }
    return users;
  }

  async update(id: number, attrs: Partial<User>) {
    if (!id) {
      throw new BadRequestException('Invalid id.');
    }
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    if (!id) {
      throw new BadRequestException('Invalid id.');
    }
    const user = await this.findOne(id);
    return await this.repo.remove(user);
  }
}
