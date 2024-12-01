import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import { CreatePresentationBlockDto } from './dto/create-presentation-block.dto';
import { UpdatePresentationBlockDto } from './dto/update-presentation-block.dto';
import { PresentationBlockType } from '@prisma/client';

@Injectable()
export class PresentationBlockService {
  constructor(private readonly prismaClient: PrismaService) {}

  async create(createPresentationBlockDto: CreatePresentationBlockDto) {
    if (
      createPresentationBlockDto.type === PresentationBlockType.General &&
      createPresentationBlockDto.duration == null
    ) {
      throw new AppException(
        'A duração da sessão geral deve ser informada',
        400,
      );
    } else if (
      createPresentationBlockDto.type === PresentationBlockType.Presentation &&
      createPresentationBlockDto.numPresentations == null
    ) {
      throw new AppException(
        'O número de apresentações deve ser informado para sessões de apresentação',
        400,
      );
    }
    const eventEdition = await this.prismaClient.eventEdition.findUnique({
      where: {
        id: createPresentationBlockDto.eventEditionId,
      },
    });
    if (typeof createPresentationBlockDto.duration != 'number') {
      createPresentationBlockDto.duration =
        createPresentationBlockDto.numPresentations *
        eventEdition.presentationDuration;
    } else {
      createPresentationBlockDto.numPresentations = 0;
    }

    if (eventEdition == null) {
      throw new AppException('Edição do evento não encontrada', 404);
    }

    if (createPresentationBlockDto.roomId) {
      const roomExists = await this.prismaClient.room.findUnique({
        where: {
          id: createPresentationBlockDto.roomId,
        },
      });

      if (roomExists == null) {
        throw new AppException('Sala não encontrada', 404);
      }
    }

    if (eventEdition.startDate > createPresentationBlockDto.startTime) {
      throw new AppException(
        'O início da sessão foi marcado para antes do início da edição do evento',
        400,
      );
    }

    if (eventEdition.endDate < createPresentationBlockDto.startTime) {
      throw new AppException(
        'O início da sessão foi marcado para depois do fim da edição do evento',
        400,
      );
    }

    const endTime =
      createPresentationBlockDto.startTime.getTime() +
      createPresentationBlockDto.duration * 1000 * 60;
    const endTimeDate = new Date(endTime);
    if (eventEdition.endDate < endTimeDate) {
      throw new AppException(
        'O fim da sessão foi marcado para depois do fim da edição do evento',
        400,
      );
    }

    // For all presentationBlocks of the same event, none can overlap with the new one
    const presentationBlocks =
      await this.prismaClient.presentationBlock.findMany({
        where: {
          eventEditionId: createPresentationBlockDto.eventEditionId,
        },
      });

    if (presentationBlocks != null) {
      for (const block of presentationBlocks) {
        const blockEndTime =
          block.startTime.getTime() + block.duration * 1000 * 60;
        const blockEndTimeDate = new Date(blockEndTime);

        if (
          (createPresentationBlockDto.startTime >= block.startTime &&
            createPresentationBlockDto.startTime < blockEndTimeDate) ||
          (endTimeDate > block.startTime && endTimeDate <= blockEndTimeDate)
        ) {
          throw new AppException(
            'A sessão informada se sobrepõe a outra sessão já existente',
            400,
          );
        }
      }
    }

    const {
      presentations,
      panelists,
      numPresentations,
      ...presentationBlockData
    } = createPresentationBlockDto;
    const createdPresentationBlock =
      await this.prismaClient.presentationBlock.create({
        data: {
          ...presentationBlockData,
          duration: createPresentationBlockDto.duration,
        },
      });

    // Assigning presentations to the block
    if (
      createPresentationBlockDto.type === PresentationBlockType.Presentation &&
      presentations &&
      presentations.length > 0 &&
      presentations.length <= numPresentations
    ) {
      const presentationsExist = await this.prismaClient.presentation.findMany({
        where: {
          id: {
            in: presentations,
          },
        },
      });
      if (presentationsExist.length !== presentations.length) {
        throw new AppException(
          'Uma das apresentações informadas não existe',
          404,
        );
      }
      await this.prismaClient.presentation.updateMany({
        where: {
          id: {
            in: presentations,
          },
        },
        data: {
          presentationBlockId: createdPresentationBlock.id,
        },
      });
    }

    // Creating panelist records
    if (panelists && panelists.length > 0) {
      const panelistsExist = await this.prismaClient.userAccount.findMany({
        where: {
          id: {
            in: panelists,
          },
        },
      });

      if (panelistsExist.length !== panelists.length) {
        throw new AppException('Um dos avaliadores informados não existe', 404);
      }

      await this.prismaClient.panelist.createMany({
        data: panelists.map((userId) => ({
          userId,
          presentationBlockId: createdPresentationBlock.id,
        })),
      });
    }

    return createdPresentationBlock;
  }

  async findAll() {
    return await this.prismaClient.presentationBlock.findMany();
  }

  async findAllByEventEditionId(eventEditionId: string) {
    const presentationBlocks =
      await this.prismaClient.presentationBlock.findMany({
        where: {
          eventEditionId,
        },
        include: {
          presentations: true,
          panelists: true,
        },
      });

    return presentationBlocks;
  }

  async findOne(id: string) {
    return await this.prismaClient.presentationBlock.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: string,
    updatePresentationBlockDto: UpdatePresentationBlockDto,
  ) {
    return await this.prismaClient.presentationBlock.update({
      where: {
        id,
      },
      data: updatePresentationBlockDto,
    });
  }

  async remove(id: string) {
    return await this.prismaClient.presentationBlock.delete({
      where: {
        id,
      },
    });
  }
}
