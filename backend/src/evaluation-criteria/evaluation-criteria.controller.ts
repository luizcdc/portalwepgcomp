import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EvaluationCriteriaService } from './evaluation-criteria.service';
import { CreateEvaluationCriteriaDto } from './dto/create-evaluation-criteria.dto';

@Controller('evaluation-criteria')
export class EvaluationCriteriaController {
  constructor(
    private readonly evaluationCriteriaService: EvaluationCriteriaService,
  ) {}

  @Get(':eventEditionId')
  async findAll(@Param('eventEditionId') eventEditionId: string) {
    return await this.evaluationCriteriaService.findAll(eventEditionId);
  }

  @Post('batch')
  async createFromList(
    @Body() evaluationCriteria: CreateEvaluationCriteriaDto[],
  ) {
    return await this.evaluationCriteriaService.createFromList(
      evaluationCriteria,
    );
  }
}
