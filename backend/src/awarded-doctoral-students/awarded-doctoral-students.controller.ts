import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AwardedDoctoralStudentsService } from './awarded-doctoral-students.service';

@Controller('awarded-doctoral-students')
export class AwardedDoctoralStudentsController {
  constructor(
    private readonly awardedDoctoralStudentsService: AwardedDoctoralStudentsService,
  ) {}

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
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.awardedDoctoralStudentsService.findTopPanelistsRanking(
      eventEditionId,
      limit,
    );
  }

  @Get('top-audience/:eventEditionId')
  async getTopAudienceRanking(
    @Param('eventEditionId') eventEditionId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.awardedDoctoralStudentsService.findTopAudienceRanking(
      eventEditionId,
      limit,
    );
  }
}
