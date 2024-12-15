import { Module } from '@nestjs/common';
import { AwardedPanelistsService } from './awarded-panelists.service';
import { AwardedPanelistsController } from './awarded-panelists.controller';

@Module({
  controllers: [AwardedPanelistsController],
  providers: [AwardedPanelistsService],
})
export class  AwardedPanelistsModule {}
