import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PanelistStatus } from '@prisma/client';
import { CreateAwardedPanelistsDto } from './dto/create-awarded-panelists.dto';
import { ResponsePanelistUserDto } from './dto/response-panelist-users.dto';
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
  ): Promise<ResponsePanelistUserDto[]> {
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

    return panelists.map(
      (panelist) => new ResponsePanelistUserDto(panelist.user),
    );
  }

  async findAll(eventEditionId: string): Promise<ResponsePanelistUserDto[]> {
    const awardedPanelists = await this.prismaClient.awardedPanelist.findMany({
      where: {
        eventEditionId,
      },
      include: {
        user: true,
      },
    });

    return awardedPanelists.map(
      (panelist) => new ResponsePanelistUserDto(panelist.user),
    );
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
