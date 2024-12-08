import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
//import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { AppException } from 'src/exceptions/app.exception';

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
        throw new AppException('Presentation not found!', 404);
      }

      // Verify if user exists
      const user = await this.prisma.userAccount.findUnique({
        where: { id: evaluation.userId },
      });
      if (!user) {
        throw new AppException('User not found!', 404);
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

  // Updating a specific evaluation
  /*
  async updateEvaluation(id: string, updateEvaluationDto: UpdateEvaluationDto) {
    const existingEvaluation = await this.prisma.evaluation.findUnique({
      where: { id },
    });

    if (!existingEvaluation) {
      throw new AppException(`Evaluation ${id} not found.`, 404);
    }

    return this.prisma.evaluation.update({
      where: { id },
      data: updateEvaluationDto,
    });
  }
*/

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
    // console.log('==> findOne userId received:', userId);
    const evaluations = await this.prisma.evaluation.findMany({
      where: { userId },
      include: {
        evaluationCriteria: true,
        submission: true,
      },
    });
    // console.log('==> findOne evaluations received:', evaluations);

    if (!evaluations) {
      throw new AppException(
        `No evaluations found for the user ${userId}`,
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
        `No evaluations found for submission ${submissionId}`,
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
