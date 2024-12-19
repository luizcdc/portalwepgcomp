import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommitteeMemberService } from './committee-member.service';
import { CreateCommitteeMemberDto } from './dto/create-committee-member.dto';
import { UpdateCommitteeMemberDto } from './dto/update-committee-member.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserLevelGuard } from '../auth/guards/user-level.guard';
import { UserLevel } from '@prisma/client';
import { Public, UserLevels } from '../auth/decorators/user-level.decorator';

@ApiBearerAuth()
@Controller('committee-member')
@UseGuards(JwtAuthGuard, UserLevelGuard)
export class CommitteeMemberController {
  constructor(
    private readonly committeeMemberService: CommitteeMemberService,
  ) {}

  @Post()
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  async create(@Body() createCommitteeMemberDto: CreateCommitteeMemberDto) {
    return await this.committeeMemberService.create(createCommitteeMemberDto);
  }

  @Public()
  @Get()
  async findAll(@Query('eventEditionId') eventEditionId: string) {
    return await this.committeeMemberService.findAll(eventEditionId);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.committeeMemberService.findOne(id);
  }

  @Patch(':id')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  async update(
    @Param('id') id: string,
    @Body() updateCommitteeMemberDto: UpdateCommitteeMemberDto,
  ) {
    return await this.committeeMemberService.update(
      id,
      updateCommitteeMemberDto,
    );
  }

  @Patch()
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  async updateByUserAndEvent(
    @Query('userId') userId: string,
    @Query('eventEditionId') eventEditionId: string,
    @Body() updateCommitteeMemberDto: UpdateCommitteeMemberDto,
  ) {
    return await this.committeeMemberService.update(
      null,
      updateCommitteeMemberDto,
      userId,
      eventEditionId,
    );
  }

  @Delete(':id')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  async remove(@Param('id') id: string) {
    return await this.committeeMemberService.remove(id);
  }

  @Delete()
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  async removeByUserAndEvent(
    @Query('userId') userId: string,
    @Query('eventEditionId') eventEditionId: string,
  ) {
    return await this.committeeMemberService.remove(
      null,
      userId,
      eventEditionId,
    );
  }
}
