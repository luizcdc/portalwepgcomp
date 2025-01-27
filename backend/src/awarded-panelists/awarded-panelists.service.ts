import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAwardedPanelistsDto } from './dto/create-awarded-panelists.dto';
import { ResponsePanelistUserDto } from './dto/response-panelist-users.dto';
import { CreateAwardedPanelistsResponseDto } from './dto/create-awarded-panelists-response.dto';
import { AppException } from '../exceptions/app.exception';

@Injectable()
export class AwardedPanelistsService {
  private readonly MAX_AWARDED_PANELISTS = 3;
  constructor(private prismaClient: PrismaService) {}

  async registerAwardedPanelists(
    createAwardedPanelistsDto: CreateAwardedPanelistsDto,
  ): Promise<CreateAwardedPanelistsResponseDto> {
    const { eventEditionId, panelists } = createAwardedPanelistsDto;

    const eventEdition = await this.prismaClient.eventEdition.findUnique({
      where: {
        id: eventEditionId,
      },
    });

    if (!eventEdition) {
      throw new AppException('Edição do evento não encontrada.', 404);
    }

    const userIds = panelists.map((p) => p.userId);
    if (new Set(userIds).size !== userIds.length) {
      throw new AppException('userIds repetidos na lista de avaliadores.', 400);
    }

    // check if the panelists are valid
    const validPanelists = await this.prismaClient.panelist.findMany({
      where: {
        userId: { in: userIds },
        presentationBlock: { eventEditionId },
      },
      distinct: ['userId'],
    });

    if (validPanelists.length !== panelists.length) {
      throw new AppException('Apenas avaliadores podem ser premiados.', 400);
    }

    const currentAwardedPanelists =
      await this.prismaClient.awardedPanelist.findMany({
        where: {
          eventEditionId,
        },
      });

    const currentAwardedPanelistIds = currentAwardedPanelists.map(
      (p) => p.userId,
    );
    const newAwardedPanelistIds = panelists.map((p) => p.userId);

    const panelistsToAdd = newAwardedPanelistIds.filter(
      (id) => !currentAwardedPanelistIds.includes(id),
    );
    const panelistsToRemove = currentAwardedPanelistIds.filter(
      (id) => !newAwardedPanelistIds.includes(id),
    );
    const panelistsToMaintain = newAwardedPanelistIds.filter((id) =>
      currentAwardedPanelistIds.includes(id),
    );

    // Check if the final count will exceed the maximum allowed
    const finalCount = newAwardedPanelistIds.length;
    if (finalCount > this.MAX_AWARDED_PANELISTS) {
      throw new AppException(
        `Não é permitido haver mais de ${this.MAX_AWARDED_PANELISTS} avaliadores premiados em uma edição.`,
        400,
      );
    }

    // Perform all database operations in a transaction
    const result = await this.prismaClient.$transaction(async (prisma) => {
      if (panelistsToRemove.length > 0) {
        await prisma.awardedPanelist.deleteMany({
          where: {
            eventEditionId,
            userId: { in: panelistsToRemove },
          },
        });
      }

      await Promise.all(
        panelistsToAdd.map((userId) =>
          prisma.awardedPanelist.create({
            data: {
              eventEditionId,
              userId,
            },
          }),
        ),
      );

      return {
        added: panelistsToAdd,
        removed: panelistsToRemove,
        maintained: panelistsToMaintain,
      };
    });

    const addedPanelists = result?.added || [];
    const removedPanelists = result?.removed || [];
    const maintainedPanelists = result?.maintained || [];

    return new CreateAwardedPanelistsResponseDto({
      addedPanelists,
      removedPanelists,
      maintainedPanelists,
    });
  }

  async findAllPanelists(
    eventEditionId: string,
  ): Promise<ResponsePanelistUserDto[]> {
    const panelists = await this.prismaClient.panelist.findMany({
      where: {
        presentationBlock: {
          eventEditionId: eventEditionId,
        },
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
    const awardedPanelist = await this.prismaClient.awardedPanelist.findFirst({
      where: {
        eventEditionId: eventEditionId,
        userId: userId,
      },
    });

    if (!awardedPanelist) {
      throw new AppException('Avaliador premiado não encontrado.', 404);
    }
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
