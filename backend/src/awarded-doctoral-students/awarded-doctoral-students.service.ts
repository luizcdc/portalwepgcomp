import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  PresentationDto,
  TopPanelistRankingResponseDto,
  TopAudienceRankingResponseDto,
} from './dto/reponse-awarded-doctoral-students.dto';

@Injectable()
export class AwardedDoctoralStudentsService {
  constructor(private prismaClient: PrismaService) {}

  async findTopPanelistsRanking(
    eventEditionId: string,
    limit: number = 3,
  ): Promise<TopPanelistRankingResponseDto> {
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

    return {
      data: presentations.map(this.mapPresentationToDto),
    };
  }

  async findTopAudienceRanking(
    eventEditionId: string,
    limit: number = 3,
  ): Promise<TopAudienceRankingResponseDto> {
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

    return {
      data: presentations.map(this.mapPresentationToDto),
    };
  }

  private mapPresentationToDto(presentation: any): PresentationDto {
    return {
      id: presentation.id,
      publicAverageScore: presentation.publicAverageScore,
      evaluatorsAverageScore: presentation.evaluatorsAverageScore,
      submission: {
        id: presentation.submission.id,
        title: presentation.submission.title,
        abstract: presentation.submission.abstract,
        pdfFile: presentation.submission.pdfFile,
        phoneNumber: presentation.submission.phoneNumber,
        coAdvisor: presentation.submission.coAdvisor,
        status: presentation.submission.status,
        mainAuthor: {
          id: presentation.submission.mainAuthor.id,
          name: presentation.submission.mainAuthor.name,
          email: presentation.submission.mainAuthor.email,
          registrationNumber:
            presentation.submission.mainAuthor.registrationNumber,
          photoFilePath: presentation.submission.mainAuthor.photoFilePath,
          profile: presentation.submission.mainAuthor.profile,
          level: presentation.submission.mainAuthor.level,
          isActive: presentation.submission.mainAuthor.isActive,
        },
      },
    };
  }
}
