import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
  Patch,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, SetAdminDto } from './dto/create-user.dto';
import { Public, UserLevels } from '../auth/decorators/user-level.decorator';
import { UserLevel } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserLevelGuard } from '../auth/guards/user-level.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, UserLevelGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
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

  @Get()
  @ApiQuery({
    name: 'roles',
    required: false,
    description:
      'Filter by user levels (e.g., "Admin", "Default"). Accepts multiple values.',
  })
  @ApiQuery({
    name: 'profiles',
    required: false,
    description:
      'Filter by profiles (e.g., "Professor", "Listener"). Accepts multiple values.',
  })
  async getUsers(
    @Query('roles') roles?: string | string[],
    @Query('profiles') profiles?: string | string[],
  ) {
    const toArray = (input?: string | string[]): string[] => {
      if (!input) return [];
      return Array.isArray(input) ? input : [input];
    };

    const rolesArray = toArray(roles);
    const profilesArray = toArray(profiles);

    return await this.userService.findAll(rolesArray, profilesArray);
  }

  @Get('advisors')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  async getAdvisors() {
    return await this.userService.findAll(['Admin', 'Superadmin'], 'Professor');
  }

  @Post('confirm-email')
  async confirmEmail(@Query('token') token: string): Promise<string> {
    const confirmed = await this.userService.confirmEmail(token);
    if (confirmed) {
      return 'E-mail confirmado com sucesso.';
    } else {
      throw new HttpException(
        'Falha ao confirmar o e-mail.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
