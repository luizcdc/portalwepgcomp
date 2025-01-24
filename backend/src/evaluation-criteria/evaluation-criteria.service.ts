import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEvaluationCriteriaDto } from './dto/create-evaluation-criteria.dto';
import { AppException } from '../exceptions/app.exception';

@Injectable()
export class EvaluationCriteriaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(eventEditionId: string) {
    return await this.prisma.evaluationCriteria.findMany({
      where: {
        eventEditionId,
      },
    });
  }

  async createFromList(evaluationCriteria: CreateEvaluationCriteriaDto[]) {
    const existingCriteria = await Promise.all(
      evaluationCriteria.map((criteria) =>
        this.prisma.evaluationCriteria.findFirst({
          where: {
            OR: [
              { title: criteria.title },
              { description: criteria.description },
            ],
            eventEditionId: criteria.eventEditionId,
          },
        }),
      ),
    );

    // Only create criteria that doesn't already exist
    const toCreate = evaluationCriteria.filter(
      (criteria, index) => !existingCriteria[index],
    );

    const duplicateTitles = toCreate.filter(
      (criteria, index) =>
        toCreate.findIndex((c) => c.title === criteria.title) !== index,
    );
    const duplicateDescriptions = toCreate.filter(
      (criteria, index) =>
        toCreate.findIndex((c) => c.description === criteria.description) !==
        index,
    );

    if (duplicateTitles.length > 0 || duplicateDescriptions.length > 0) {
      throw new AppException(
        'Não é possível criar dois critérios de avaliação com o mesmo título ou descrição para o mesmo evento',
        400,
      );
    }

    return await this.prisma.evaluationCriteria.createMany({
      data: toCreate,
    });
  }
}
