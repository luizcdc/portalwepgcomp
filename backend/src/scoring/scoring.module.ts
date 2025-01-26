import { Module } from '@nestjs/common';
import { ScoringService } from './scoring.service';

@Module({
  providers: [ScoringService],
  exports: [ScoringService],
})
export class ScoringModule {}
