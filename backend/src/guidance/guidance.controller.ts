import {
  Controller,
  Get,
  Body,
  Delete,
  Post,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GuidanceService } from './guidance.service';
import { UpdateGuidanceDto } from './dto/update-guidance.dto';
import { CreateGuidanceDto } from './dto/create-guidance.dto';
import { Public, UserLevels } from '../auth/decorators/user-level.decorator';
import { UserLevelGuard } from '../auth/guards/user-level.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserLevel } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('guidance')
@UseGuards(JwtAuthGuard, UserLevelGuard)
export class GuidanceController {
  constructor(private readonly guidanceService: GuidanceService) {}

  @Public()
  @Get()
  async getGuidance() {
    return this.guidanceService.getActiveInstance();
  }

  @Public()
  @Get(':id')
  async getGuidanceById(@Param('id') id: string) {
    return this.guidanceService.getById(id);
  }

  @Delete(':id')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  @ApiBearerAuth()
  async deleteGuidance(@Param('id') id: string) {
    return this.guidanceService.remove(id);
  }

  @Post()
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  @ApiBearerAuth()
  async createGuidance(@Body() createGuidanceDto: CreateGuidanceDto) {
    return this.guidanceService.create(createGuidanceDto);
  }

  @Put('/active')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  @ApiBearerAuth()
  async updateActiveGuidance(@Body() updateGuidanceDto: UpdateGuidanceDto) {
    return this.guidanceService.updateActive(updateGuidanceDto);
  }

  @Put(':id')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  @ApiBearerAuth()
  async updateGuidance(
    @Param('id') id: string,
    @Body() updateGuidanceDto: UpdateGuidanceDto,
  ) {
    return this.guidanceService.update(id, updateGuidanceDto);
  }
}
