import { Module } from '@nestjs/common';
import { EventEditionController } from './event-edition.controller';
import { EventEditionService } from './event-edition.service';
import { ScoringModule } from '../scoring/scoring.module';

@Module({
  controllers: [EventEditionController],
  providers: [EventEditionService],
  exports: [EventEditionService],
  imports: [ScoringModule],
})
export class EventEditionModule {}
