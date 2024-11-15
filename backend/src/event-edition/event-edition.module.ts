import { Module } from '@nestjs/common';
import { EventEditionController } from './event-edition.controller';
import { EventEditionService } from './event-edition.service';

@Module({
  controllers: [EventEditionController],
  providers: [EventEditionService],
})
export class EventEditionModule {}
