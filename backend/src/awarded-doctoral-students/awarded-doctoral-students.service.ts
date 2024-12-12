import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AwardedDoctoralStudentsService {
  constructor(private prismaClient: PrismaService) {}

  async findTopPanelistsRanking(eventEditionId: string, limit: number = 3) {
    return this.prismaClient.presentation.findMany({
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
  }

  async findTopAudienceRanking(eventEditionId: string, limit: number = 3) {
    return this.prismaClient.presentation.findMany({
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
  }
}
