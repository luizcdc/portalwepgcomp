import { Controller, Get, Param } from '@nestjs/common';
import { EvaluationCriteriaService } from './evaluation-criteria.service';

@Controller('evaluation-criteria')
export class EvaluationCriteriaController {
  constructor(
    private readonly evaluationCriteriaService: EvaluationCriteriaService,
  ) {}

  @Get(':eventEditionId')
  async findAll(@Param('eventEditionId') eventEditionId: string) {
    return await this.evaluationCriteriaService.findAll(eventEditionId);
  }
}
