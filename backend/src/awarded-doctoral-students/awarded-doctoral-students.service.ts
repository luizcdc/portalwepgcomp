import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AwardedDoctoralStudentsService {
  constructor(private prismaClient: PrismaService) {}

  findTopPanelistsRanking(eventEditionId: string, limit: number = 3) {
    return this.prismaClient.submission.findMany({
      where: {
        eventEditionId: eventEditionId,
        PanelistRanking: {
          not: null,
        },
      },
      orderBy: {
        PanelistRanking: 'desc',
      },
      take: limit,
      include: {
        mainAuthor: true,
      },
    });
  }

  findTopAudienceRanking(eventEditionId: string, limit: number = 3) {
    return this.prismaClient.submission.findMany({
      where: {
        eventEditionId: eventEditionId,
        AudienceRanking: {
          not: null,
        },
      },
      orderBy: {
        AudienceRanking: 'desc',
      },
      take: limit,
      include: {
        mainAuthor: true,
      },
    });
  }
}
