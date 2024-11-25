import { Controller, Get, Param, } from '@nestjs/common';
import { AwardedDoctoralStudentsService } from './awarded-doctoral-students.service';

@Controller('awarded-doctoral-students')
export class AwardedDoctoralStudentsController {
  constructor(private readonly awardedDoctoralStudentsService: AwardedDoctoralStudentsService) {}

  @Get('top-panelists/:eventEditionId')
  async getTopPanelistsRanking(@Param('eventEditionId') eventEditionId: string) {
    return this.awardedDoctoralStudentsService.findTopPanelistsRanking(eventEditionId);
  }

  @Get('top-audience/:eventEditionId')
  async getTopAudienceRanking(@Param('eventEditionId') eventEditionId: string) {
    return this.awardedDoctoralStudentsService.findTopAudienceRanking(eventEditionId);
  }
}
