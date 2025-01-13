import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RankingResponseDtoDto } from './dto/reponse-awarded-doctoral-students.dto';

@Injectable()
export class AwardedDoctoralStudentsService {
  constructor(private prismaClient: PrismaService) {}

  async findTopEvaluatorsRanking(
    eventEditionId: string,
    limit: number = 3,
  ): Promise<RankingResponseDtoDto[]> {
    const presentations = await this.prismaClient.presentation.findMany({
      where: {
        presentationBlock: {
          eventEditionId: eventEditionId,
        },
        evaluatorsAverageScore: {
          not: null,
        },
      },
      orderBy: {
        evaluatorsAverageScore: 'desc',
      },
      take: limit,
      include: {
        submission: {
          include: {
            mainAuthor: true,
          },
        },
      },
    });

    return presentations.map(
      (presentation) => new RankingResponseDtoDto(presentation),
    );
  }

  async findTopPublicRanking(
    eventEditionId: string,
    limit: number = 3,
  ): Promise<RankingResponseDtoDto[]> {
    const presentations = await this.prismaClient.presentation.findMany({
      where: {
        presentationBlock: {
          eventEditionId: eventEditionId,
        },
        publicAverageScore: {
          not: null,
        },
      },
      orderBy: {
        publicAverageScore: 'desc',
      },
      take: limit,
      include: {
        submission: {
          include: {
            mainAuthor: true,
          },
        },
      },
    });

    return presentations.map(
      (presentation) => new RankingResponseDtoDto(presentation),
    );
  }
}
