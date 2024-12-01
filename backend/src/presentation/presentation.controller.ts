import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { CreatePresentationWithSubmissionDto } from './dto/create-presentation-with-submission.dto';
import { UpdatePresentationWithSubmissionDto } from './dto/update-presentation-with-submission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserLevelGuard } from 'src/auth/guards/user-level.guard';

@Controller('presentation')
@UseGuards(JwtAuthGuard, UserLevelGuard)
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

  /**
   * List presentations of the logged-in user.
   * @param req - Request containing authenticated user information.
   * @returns List of presentations for the logged-in user.
   */
  @Get('my')
  listPresentations(@Request() req) {
    const userId = req.user.userId; // User ID extracted from the JWT
    return this.presentationService.listUserPresentations(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presentationService.findOne(id);
  }

  /**
   * Update a presentation linked to the logged-in user.
   * @param req - Request containing authenticated user information.
   * @param id - ID of the presentation to be updated.
   * @param updatePresentationDto - Data for updating the presentation.
   * @returns Updated presentation.
   */
  @Put(':id/my')
  updatePresentationForUser(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePresentationDto: UpdatePresentationDto,
  ) {
    const userId = req.user.userId; // User ID extracted from the JWT
    return this.presentationService.updatePresentationForUser(
      userId,
      id,
      updatePresentationDto,
    );
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
