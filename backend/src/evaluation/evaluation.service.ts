import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from 'src/exceptions/app.exception';
import { CreateEvaluationsDto } from './dto/create-evaluation.dto';

@Injectable()
export class EvaluationService {
    constructor(private readonly prisma: PrismaService) {}

  async registerEvaluation(
    createEvaluationDto: CreateEvaluationsDto
  ) {
    // Verificar se a apresentação existe
    const presentation = await this.prisma.submission.findUnique({
      where: { id: createEvaluationDto.submissionId  },
    });
    if (!presentation) {
      throw new AppException("Apresentação não encontrada!", 404)//Error('Presentation not found');
    }

    // Verificar se o usuário existe
    const user = await this.prisma.userAccount.findUnique({
      where: { id: createEvaluationDto.userId },
    });
    if (!user) {
      throw new AppException("Usuário não encontrado!", 404)//Error('User not found');
    }
    
    try {
      const results = await this.prisma.$transaction(async (prisma) => {
        const evaluations = [];
        for (const criteriaGrade of createEvaluationDto.grades) {
          const evaluation = await prisma.evaluation.create({
            data: {
              userId: createEvaluationDto.userId,
              submissionId: createEvaluationDto.submissionId,
              comments: createEvaluationDto.comments,
              name: createEvaluationDto.name,
              email: createEvaluationDto.email,
              evaluationCriteriaId: criteriaGrade.evaluationCriteriaId,
              score: criteriaGrade.score,
            },
          });
          evaluations.push(evaluation);
        }
        return evaluations;
      });
      return results;
    } catch (error) {
      throw new AppException(
        'Erro ao registrar avaliações. Tente novamente mais tarde.',
        500,
      );
    }
  }
}