import { Body, Controller, Post, Patch, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, SetAdminDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserLevelGuard } from 'src/auth/guards/user-level.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, UserLevelGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('set-admin')
  async setAdmin(@Body() setAdminDto: SetAdminDto) {
    return await this.userService.setAdmin(setAdminDto);
  }

  @Post('set-super-admin')
  async setSuperAdmin(@Body() setAdminDto: SetAdminDto) {
    return await this.userService.setSuperAdmin(setAdminDto);
  }

  @Patch('activate/:id')
  async activateUser(@Param('id') id: string) {
    return this.userService.activateProfessor(id);
  }
}
