import { Module } from '@nestjs/common';
import { GuidanceService } from './guidance.service';
import { GuidanceController } from './guidance.controller';
import { EventEditionModule } from '../event-edition/event-edition.module';

@Module({
  providers: [GuidanceService],
  controllers: [GuidanceController],
  imports: [EventEditionModule],
})
export class GuidanceModule {}
