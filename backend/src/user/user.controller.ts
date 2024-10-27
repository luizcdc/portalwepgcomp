import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async create(@Body() createUserRequestDto: CreateUserRequestDto) {
    return await this.userService.create(createUserRequestDto);
  }
}
