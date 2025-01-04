import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UserLevelGuard } from '../auth/guards/user-level.guard';
import { UserLevel } from '@prisma/client';
import { UserLevels } from '../auth/decorators/user-level.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppException } from 'src/exceptions/app.exception';

@Controller('evaluations')
@UseGuards(JwtAuthGuard, UserLevelGuard)
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Put()
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find evaluations' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter evaluations by user ID',
  })
  @ApiResponse({ status: 200, description: 'Return evaluations.' })
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  async find(@Req() request: any, @Query('userId') userId?: string) {
    if (
      userId &&
      (request.user.userId === userId ||
        request.user.level !== UserLevel.Default)
    ) {
      return await this.evaluationService.findOne(userId);
    } else if (userId) {
      throw new AppException(
        'Este usuário não tem permissão para acessar as avaliações de outro usuário',
        403,
      );
    }

    if (request.user.level !== UserLevel.Default) {
      return await this.evaluationService.findAll();
    }
    throw new AppException(
      'Este usuário não tem permissão para acessar avaliações de outros usuários',
      403,
    );
  }

  @Get('/user')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find evaluations by user' })
  async findByUser(@Request() req) {
    const userId = req.user.userId;

    return await this.evaluationService.findOne(userId);
  }

  @Get('submission/:submissionId/final-grade')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  @ApiBearerAuth()
  async calculateFinalGrade(@Param('submissionId') submissionId: string) {
    return await this.evaluationService.calculateFinalGrade(submissionId);
  }
}
