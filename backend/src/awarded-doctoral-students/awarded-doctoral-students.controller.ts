import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AwardedDoctoralStudentsService } from './awarded-doctoral-students.service';
import { RankingResponseDtoDto } from './dto/reponse-awarded-doctoral-students.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserLevelGuard } from '../auth/guards/user-level.guard';
import { Public } from '../auth/decorators/user-level.decorator';

@Controller('awarded-doctoral-students')
@UseGuards(JwtAuthGuard, UserLevelGuard)
export class AwardedDoctoralStudentsController {
  constructor(
    private readonly awardedDoctoralStudentsService: AwardedDoctoralStudentsService,
  ) {}

  @Public()
  @Get('top-panelists/:eventEditionId')
  @ApiOperation({
    summary: 'Get top submissions ranked by panelists',
    description:
      'Retrieve top submissions for a specific event edition, ranked by panelists',
  })
  @ApiParam({
    name: 'eventEditionId',
    description: 'The ID of the event edition',
    type: 'string',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of top submissions to retrieve (default: 3)',
    required: false,
    type: 'number',
  })
  async getTopPanelistsRanking(
    @Param('eventEditionId') eventEditionId: string,
    @Query('limit') limit?: string,
  ): Promise<RankingResponseDtoDto[]> {
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    return this.awardedDoctoralStudentsService.findTopEvaluatorsRanking(
      eventEditionId,
      parsedLimit,
    );
  }

  @Public()
  @Get('top-audience/:eventEditionId')
  @ApiOperation({
    summary: 'Get top submissions ranked by audience',
    description:
      'Retrieve top submissions for a specific event edition, ranked by audience',
  })
  @ApiParam({
    name: 'eventEditionId',
    description: 'The ID of the event edition',
    type: 'string',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of top submissions to retrieve (default: 3)',
    required: false,
    type: 'number',
  })
  async getTopAudienceRanking(
    @Param('eventEditionId') eventEditionId: string,
    @Query('limit') limit?: string,
  ): Promise<RankingResponseDtoDto[]> {
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    return this.awardedDoctoralStudentsService.findTopPublicRanking(
      eventEditionId,
      parsedLimit,
    );
  }
}
