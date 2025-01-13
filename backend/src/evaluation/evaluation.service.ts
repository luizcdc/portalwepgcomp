import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { AppException } from '../exceptions/app.exception';

@Injectable()
export class EvaluationService {
  constructor(private readonly prisma: PrismaService) {}

  // Create or update evaluation
  async create(evaluations: CreateEvaluationDto[]) {
    const results = [];

    for (const evaluation of evaluations) {
      // Verify if presentation exists
      const presentation = await this.prisma.submission.findUnique({
        where: { id: evaluation.submissionId },
      });
      if (!presentation) {
        throw new AppException('Apresentação não encontrada.', 404);
      }

      // Verify if user exists
      const user = await this.prisma.userAccount.findUnique({
        where: { id: evaluation.userId },
      });
      if (!user) {
        throw new AppException('Usuário não encontrado.', 404);
      }

      const existingEvaluation = await this.prisma.evaluation.findFirst({
        where: {
          userId: evaluation.userId,
          submissionId: evaluation.submissionId,
          evaluationCriteriaId: evaluation.evaluationCriteriaId,
        },
      });

      if (existingEvaluation) {
        // Update existing evaluations
        const updatedEvaluation = await this.prisma.evaluation.update({
          where: { id: existingEvaluation.id },
          data: { score: evaluation.score, comments: evaluation.comments },
        });
        results.push(updatedEvaluation);
      }
    }
    // Filter only evaluations that doesn't exists, for a bulk creation
    const newEvaluations = evaluations.filter(
      (evaluation) =>
        !results.some(
          (res) =>
            res.userId === evaluation.userId &&
            res.submissionId === evaluation.submissionId &&
            res.evaluationCriteriaId === evaluation.evaluationCriteriaId,
        ),
    );

    if (newEvaluations.length > 0) {
      // Creating new evaluations in simple batch
      await this.prisma.evaluation.createMany({
        data: newEvaluations,
      });
      results.push(...newEvaluations);
    }

    return results;
  }
  // List all evaluations
  async findAll() {
    return this.prisma.evaluation.findMany({
      include: {
        user: true,
        evaluationCriteria: true,
        submission: true,
      },
    });
  }

  // List all evaluations for a specific user
  async findOne(userId: string) {
    const evaluations = await this.prisma.evaluation.findMany({
      where: { userId },
      include: {
        evaluationCriteria: true,
        submission: true,
      },
    });
    if (!evaluations) {
      throw new AppException(
        `Nenhuma avaliação encontrada para o usuário ${userId}`,
        404,
      );
    }
    return evaluations;
  }

  // Calculation of the final grade for a specific submission (5 evaluations for 1 submission made by 1 user)
  async calculateFinalGrade(submissionId: string) {
    const evaluations = await this.prisma.evaluation.findMany({
      where: { submissionId },
      select: { score: true },
    });

    if (evaluations.length === 0) {
      throw new AppException(
        `Nenhuma avaliação encontrada para o usuário ${submissionId}`,
        404,
      );
    }

    const totalScore = evaluations.reduce(
      (sum, evaluation) => sum + evaluation.score,
      0,
    );
    const finalGrade = totalScore / evaluations.length;

    return finalGrade;
  }
}
