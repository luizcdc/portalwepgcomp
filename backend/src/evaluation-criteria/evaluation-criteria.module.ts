import { Module } from '@nestjs/common';
import { EvaluationCriteriaService } from './evaluation-criteria.service';
import { EvaluationCriteriaController } from './evaluation-criteria.controller';

@Module({
  controllers: [EvaluationCriteriaController],
  providers: [EvaluationCriteriaService],
})
export class EvaluationCriteriaModule {}
