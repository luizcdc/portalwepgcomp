import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AwardedPanelistsService } from './awarded-panelists.service';
import { CreateAwardedPanelistsDto } from './dto/create-awarded-panelists.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('panelist-awards')
export class AwardedPanelistsController {
  constructor(
    private readonly awardedPanelistsService: AwardedPanelistsService,
  ) {}

  @Post('bulk')
  @ApiOperation({
    summary: 'Register awarded panelists in bulk',
    description:
      'Register multiple awarded panelists for a specific event edition',
  })
  @ApiBody({
    type: CreateAwardedPanelistsDto,
    description: 'Data for registering awarded panelists',
  })
  async registerAwardedPanelists(
    @Body() createAwardedPanelistsDto: CreateAwardedPanelistsDto,
  ) {
    return this.awardedPanelistsService.registerAwardedPanelists(
      createAwardedPanelistsDto,
    );
  }

  @Get(':eventEditionId')
  async findAll(@Param('eventEditionId') eventEditionId: string) {
    return this.awardedPanelistsService.findAll(eventEditionId);
  }

  @Get(':eventEditionId/panelists')
  async findAllPanelists(@Param('eventEditionId') eventEditionId: string) {
    return this.awardedPanelistsService.findAllPanelists(eventEditionId);
  }

  @Delete(':eventEditionId/:userId')
  async remove(
    @Param('eventEditionId') eventEditionId: string,
    @Param('userId') userId: string,
  ) {
    await this.awardedPanelistsService.remove(eventEditionId, userId);
    return { message: 'removido com sucesso.' };
  }
}
