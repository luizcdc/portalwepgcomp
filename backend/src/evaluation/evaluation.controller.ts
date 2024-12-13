import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
@Controller('evaluations')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new evaluations.',
  })
  @ApiBody({
    type: [CreateEvaluationDto],
    description:
      'Array of evaluations (one for each criteria), all for the same submissionId.',
  })
  @ApiResponse({
    status: 201,
    description: 'The evaluations have been created successfully.',
  })
  async create(@Body() evaluations: CreateEvaluationDto[]) {
    return await this.evaluationService.create(evaluations);
  }

  @Get()
  @ApiOperation({ summary: 'Find evaluations' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter evaluations by user ID',
  })
  @ApiResponse({ status: 200, description: 'Return evaluations.' })
  async find(@Query('userId') userId?: string) {
    if (userId) {
      return await this.evaluationService.findOne(userId);
    }
    return await this.evaluationService.findAll();
  }

  @Get('submission/:submissionId/final-grade')
  async calculateFinalGrade(@Param('submissionId') submissionId: string) {
    return await this.evaluationService.calculateFinalGrade(submissionId);
  }
}
