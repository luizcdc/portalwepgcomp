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

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionService.create(createSubmissionDto);
  }

  @Get()
  findAll(
    @Query('eventEditionId') eventEditionId: string,
    @Query('withoutPresentation') withoutPresentation: string = 'false',
    @Query('orderByProposedPresentation')
    orderByProposedPresentation: string = 'false',
    @Query('showConfirmedOnly') showConfirmedOnly: string = 'false',
  ): Promise<ResponseSubmissionDto[]> {
    const withoutPresentationFlag = withoutPresentation === 'true'; // Convert to boolean
    const orderByFlag = orderByProposedPresentation === 'true';
    const showConfirmedOnlyFlag = showConfirmedOnly === 'true';

    return this.submissionService.findAll(
      eventEditionId,
      withoutPresentationFlag,
      orderByFlag,
      showConfirmedOnlyFlag,
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
