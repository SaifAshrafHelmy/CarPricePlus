import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body.email, body.password);
  }

  // @Post('login')
  // loginUser(@Body() body: CreateUserDto) {
  //   return this.usersService.login(body.email, body.password);
  // }
  @Get(':id')
  findUser(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.findAllByEmail(email);
  }

  @Patch(':id')
  updateUser(@Param('id') id: number, @Body() attrs: UpdateUserDto) {
    return this.usersService.update(id, attrs);
  }

  @Delete(':id')
  removeUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
