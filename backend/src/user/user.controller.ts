import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, SetAdminDto } from './dto/create-user.dto';
import { UserLevels } from '../auth/decorators/user-level.decorator';
import { UserLevel } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserLevelGuard } from '../auth/guards/user-level.guard';

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

  @Delete('delete/:id')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }

  @Patch('activate/:id')
  @UserLevels(UserLevel.Superadmin)
  async activateUser(@Param('id') id: string) {
    return this.userService.activateProfessor(id);
  }
}
