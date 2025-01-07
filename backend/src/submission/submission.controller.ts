import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import {
  CreateSubmissionDto,
  CreateSubmissionInCurrentEventDto,
} from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { ResponseSubmissionDto } from './dto/response-submission.dto';
import { ApiQuery } from '@nestjs/swagger';
import { UserLevel } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserLevelGuard } from '../auth/guards/user-level.guard';
import { UserLevels } from '../auth/decorators/user-level.decorator';

@Controller('submission')
@UseGuards(JwtAuthGuard, UserLevelGuard)
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionService.create(createSubmissionDto);
  }

  @Post('/create-in-current-event')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  createInCurrentEvent(
    @Body()
    createSubmissionInCurrentEventDto: CreateSubmissionInCurrentEventDto,
  ) {
    return this.submissionService.createInCurrentEvent(
      createSubmissionInCurrentEventDto,
    );
  }

  @Get()
  @ApiQuery({ name: 'eventEditionId', required: true, type: String })
  @ApiQuery({ name: 'withoutPresentation', required: false, type: Boolean })
  @ApiQuery({
    name: 'orderByProposedPresentation',
    required: false,
    type: Boolean,
  })
  @ApiQuery({ name: 'showConfirmedOnly', required: false, type: Boolean })
  findAll(
    @Query('eventEditionId') eventEditionId: string,
    @Query('withoutPresentation') withoutPresentation: boolean = false,
    @Query('orderByProposedPresentation')
    orderByProposedPresentation: boolean = false,
    @Query('showConfirmedOnly') showConfirmedOnly: boolean = false,
  ): Promise<ResponseSubmissionDto[]> {
    return this.submissionService.findAll(
      eventEditionId,
      withoutPresentation,
      orderByProposedPresentation,
      showConfirmedOnly,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(id);
  }

  @Patch(':id')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return this.submissionService.update(id, updateSubmissionDto);
  }

  @Delete(':id')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  remove(@Param('id') id: string) {
    return this.submissionService.remove(id);
  }
}
