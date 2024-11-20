import { Module } from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { PresentationController } from './presentation.controller';

@Module({
  controllers: [PresentationController],
  providers: [PresentationService],
})
export class PresentationModule {}
