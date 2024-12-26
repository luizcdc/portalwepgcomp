import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
