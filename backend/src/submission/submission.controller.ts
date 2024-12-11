import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { ResponseSubmissionDto } from './dto/response-submission.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionService.create(createSubmissionDto);
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
  update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return this.submissionService.update(id, updateSubmissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submissionService.remove(id);
  }
}
