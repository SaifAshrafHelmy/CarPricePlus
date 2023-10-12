import {
  Body,
  Session,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from './interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from './guards/auth.guard';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/whoamI')
  whoAmI(@CurrentUser() user: User) {
    return user;
    // if (!session.userId) {
    //   throw new HttpException(`You're not signed in.`, HttpStatus.FORBIDDEN);
    // }
    // return this.usersService.findOne(session.userId);
  }

  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('login')
  async loginUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('logout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  // @UseInterceptors(SerializeInterceptor)
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
