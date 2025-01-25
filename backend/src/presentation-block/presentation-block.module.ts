import { Module } from '@nestjs/common';
import { PresentationBlockService } from './presentation-block.service';
import { PresentationBlockController } from './presentation-block.controller';
import { ScoringModule } from '../scoring/scoring.module';

@Module({
  controllers: [PresentationBlockController],
  providers: [PresentationBlockService],
  imports: [ScoringModule],
})
export class PresentationBlockModule {}
