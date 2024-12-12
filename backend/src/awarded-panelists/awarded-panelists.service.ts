import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PanelistStatus } from '@prisma/client';
import { GetPanelistUsersDto } from './dto/get-panelist-users.dto';
import { CreateAwardedPanelistsDto } from './dto/create-awarded-panelists.dto';
import { AppException } from '../exceptions/app.exception';

@Injectable()
export class AwardedPanelistsService {
  constructor(private prismaClient: PrismaService) {}

  async registerAwardedPanelists(
    createAwardedPanelistsDto: CreateAwardedPanelistsDto,
  ) {
    const { eventEditionId, panelists } = createAwardedPanelistsDto;

    const currentAwardedPanelists =
      await this.prismaClient.awardedPanelist.count({
        where: { eventEditionId },
      });

    if (currentAwardedPanelists + panelists.length > 3) {
      throw new AppException(
        'Não é permitido haver mais de 3 avaliadores premiados em uma edição.',
        400,
      );
    }

    const awardedPanelists = await this.prismaClient.awardedPanelist.createMany(
      {
        data: panelists.map((panelist) => ({
          eventEditionId: eventEditionId,
          userId: panelist.userId,
        })),
      },
    );

    return awardedPanelists;
  }

  async findAllPanelists(
    eventEditionId: string,
  ): Promise<GetPanelistUsersDto[]> {
    const panelists = await this.prismaClient.panelist.findMany({
      where: {
        presentationBlock: {
          eventEditionId: eventEditionId,
        },
        status: PanelistStatus.Present,
      },
      include: {
        user: true,
      },
      distinct: ['userId'],
    });

    return panelists.map((panelist) => {
      const { user } = panelist;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        registrationNumber: user.registrationNumber,
        photoFilePath: user.photoFilePath,
        profile: user.profile,
        level: user.level,
      };
    });
  }

  async findAll(eventEditionId: string) {
    return this.prismaClient.awardedPanelist.findMany({
      where: {
        eventEditionId: eventEditionId,
      },
      include: {
        user: true,
      },
    });
  }

  async remove(eventEditionId: string, userId: string) {
    await this.prismaClient.awardedPanelist.delete({
      where: {
        eventEditionId_userId: {
          eventEditionId: eventEditionId,
          userId: userId,
        },
      },
    });
  }
}
