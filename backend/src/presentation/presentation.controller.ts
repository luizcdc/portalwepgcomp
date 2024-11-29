import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { CreatePresentationWithSubmissionDto } from './dto/create-presentation-with-submission.dto';
import { UpdatePresentationWithSubmissionDto } from './dto/update-presentation-with-submission.dto';

@Controller('presentation')
export class PresentationController {
  constructor(private readonly presentationService: PresentationService) {}

  @Post()
  create(@Body() createPresentationDto: CreatePresentationDto) {
    return this.presentationService.create(createPresentationDto);
  }

  @Post('with-submission')
  createWithSubmission(
    @Body()
    createPresentationWithSubmissionDto: CreatePresentationWithSubmissionDto,
  ) {
    return this.presentationService.createWithSubmission(
      createPresentationWithSubmissionDto,
    );
  }

  @Get()
  findAll(@Param('eventEditionId') eventEditionId: string) {
    return this.presentationService.findAllByEventEditionId(eventEditionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presentationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePresentationDto: UpdatePresentationDto,
  ) {
    return this.presentationService.update(id, updatePresentationDto);
  }

  @Patch('with-submission/:id')
  updateWithSubmission(
    @Param('id') id: string,
    @Body()
    updatePresentationWithSubmissionDto: UpdatePresentationWithSubmissionDto,
  ) {
    return this.presentationService.updateWithSubmission(
      id,
      updatePresentationWithSubmissionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presentationService.remove(id);
  }
}
