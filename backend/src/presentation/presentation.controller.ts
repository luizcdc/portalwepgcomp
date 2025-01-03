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
  Query,
} from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { CreatePresentationWithSubmissionDto } from './dto/create-presentation-with-submission.dto';
import { UpdatePresentationWithSubmissionDto } from './dto/update-presentation-with-submission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserLevelGuard } from '../auth/guards/user-level.guard';
import { PresentationResponseDto } from './dto/response-presentation.dto';
import {
  BookmarkedPresentationResponseDto,
  BookmarkedPresentationsResponseDto,
  BookmarkPresentationRequestDto,
  BookmarkPresentationResponseDto,
} from './dto/bookmark-presentation.dto';
import { Public, UserLevels } from '../auth/decorators/user-level.decorator';
import { UserLevel } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ListAdvisedPresentationsResponse } from './dto/list-advised-presentations.dto';

@Controller('presentation')
@UseGuards(JwtAuthGuard, UserLevelGuard)
export class PresentationController {
  constructor(private readonly presentationService: PresentationService) {}

  @Get('bookmarks')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  @ApiBearerAuth()
  bookmarkedPresentations(
    @Request() req,
  ): Promise<BookmarkedPresentationsResponseDto> {
    const userId = req.user.userId;

    return this.presentationService.bookmarkedPresentations(userId);
  }

  @Get('bookmark')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  @ApiBearerAuth()
  bookmarkedPresentation(
    @Request() req,
    @Query('presentationId') presentationId: string,
  ): Promise<BookmarkedPresentationResponseDto> {
    const userId = req.user.userId;

    return this.presentationService.bookmarkedPresentation(
      userId,
      presentationId,
    );
  }

  @Post('bookmark')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  @ApiBearerAuth()
  bookmarkPresentation(
    @Request() req,
    @Body() bookmarkPresentationRequestDto: BookmarkPresentationRequestDto,
  ): Promise<BookmarkPresentationResponseDto> {
    const userId = req.user.userId;

    return this.presentationService.bookmarkPresentation(
      bookmarkPresentationRequestDto,
      userId,
    );
  }

  @Delete('bookmark')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  @ApiBearerAuth()
  removePresentationBookmark(
    @Request() req,
    @Query('presentationId') presentationId: string,
  ): Promise<BookmarkedPresentationsResponseDto> {
    const userId = req.user.userId;

    return this.presentationService.removePresentationBookmark(
      presentationId,
      userId,
    );
  }

  @Post()
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  @ApiBearerAuth()
  create(@Body() createPresentationDto: CreatePresentationDto) {
    return this.presentationService.create(createPresentationDto);
  }

  @Post('with-submission')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  @ApiBearerAuth()
  createWithSubmission(
    @Body()
    createPresentationWithSubmissionDto: CreatePresentationWithSubmissionDto,
  ) {
    return this.presentationService.createWithSubmission(
      createPresentationWithSubmissionDto,
    );
  }

  @Public()
  @Get()
  findAll(
    @Query('eventEditionId') eventEditionId: string,
  ): Promise<PresentationResponseDto[]> {
    return this.presentationService.findAllByEventEditionId(eventEditionId);
  }

  /**
   * List presentations of the logged-in user.
   * @param req - Request containing authenticated user information.
   * @returns List of presentations for the logged-in user.
   */
  @Get('my')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  @ApiBearerAuth()
  listPresentations(@Request() req) {
    const userId = req.user.userId; // User ID extracted from the JWT
    return this.presentationService.listUserPresentations(userId);
  }

  @Get('advised')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  @ApiBearerAuth()
  listAdvisedPresentations(
    @Request() req,
  ): Promise<Array<ListAdvisedPresentationsResponse>> {
    const userId = req.user.userId;
    return this.presentationService.listAdvisedPresentations(userId);
  }

  @Public()
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
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  @ApiBearerAuth()
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
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updatePresentationDto: UpdatePresentationDto,
  ) {
    return this.presentationService.update(id, updatePresentationDto);
  }

  @Patch('with-submission/:id')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  @ApiBearerAuth()
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
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.presentationService.remove(id);
  }
}
