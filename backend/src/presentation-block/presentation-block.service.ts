import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import { CreatePresentationBlockDto } from './dto/create-presentation-block.dto';
import { UpdatePresentationBlockDto } from './dto/update-presentation-block.dto';
import { PresentationBlockType } from '@prisma/client';
import { SwapPresentationsDto } from './dto/swap-presentations.dto';

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
        where: { eventEditionId },
        include: {
          presentations: {
            include: {
              submission: true,
            },
          },
          panelists: {
            include: {
              user: true,
            },
          },
        },
      });

    const eventEdition = await this.prismaClient.eventEdition.findUnique({
      where: { id: eventEditionId },
    });

    if (!eventEdition) {
      throw new AppException('Edição do evento não encontrada', 404);
    }

    return Promise.all(
      presentationBlocks.map((block) => this.processPresentationBlock(block)),
    );
  }

  async findOne(id: string) {
    const presentationBlock =
      await this.prismaClient.presentationBlock.findUnique({
        where: { id },
        include: {
          presentations: {
            include: {
              submission: true,
            },
          },
          panelists: {
            include: {
              user: true,
            },
          },
        },
      });

    if (!presentationBlock) {
      throw new AppException('Sessão não encontrada', 404);
    }

    return this.processPresentationBlock(presentationBlock);
  }

  async update(
    id: string,
    updatePresentationBlockDto: UpdatePresentationBlockDto,
  ) {
    if (
      updatePresentationBlockDto.duration == null &&
      updatePresentationBlockDto.numPresentations == null
    ) {
      throw new AppException(
        'É necessário informar a duração da sessão ou o número de apresentações',
        400,
      );
    } else if (
      updatePresentationBlockDto.duration != null &&
      updatePresentationBlockDto.numPresentations != null
    ) {
      throw new AppException(
        'Informe ou duração ou número de apresentações, não ambos',
        400,
      );
    } else if (
      updatePresentationBlockDto.duration != null &&
      updatePresentationBlockDto.type === PresentationBlockType.Presentation
    ) {
      throw new AppException(
        'A duração não pode ser especificada para sessões de apresentação, apenas número de apresentações',
        400,
      );
    } else if (
      updatePresentationBlockDto.numPresentations != null &&
      updatePresentationBlockDto.type === PresentationBlockType.General
    ) {
      throw new AppException(
        'O número de apresentações não pode ser especificado para sessões gerais, apenas a duração',
        400,
      );
    }
    if (updatePresentationBlockDto.duration == null) {
      const presentationBlock =
        await this.prismaClient.presentationBlock.findUnique({
          where: {
            id,
          },
        });
      if (presentationBlock == null) {
        throw new AppException('Sessão não encontrada', 404);
      }
      const eventEdition = await this.prismaClient.eventEdition.findUnique({
        where: {
          id: presentationBlock.eventEditionId,
        },
      });
      updatePresentationBlockDto.duration =
        eventEdition.presentationDuration *
        updatePresentationBlockDto.numPresentations;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { numPresentations, ...without_num_presentations } =
      updatePresentationBlockDto;
    return await this.prismaClient.presentationBlock.update({
      where: {
        id,
      },
      data: without_num_presentations,
    });
  }

  async remove(id: string) {
    return await this.prismaClient.presentationBlock.delete({
      where: {
        id,
      },
    });
  }

  async swapPresentations(
    id: string,
    swapPresentationsDto: SwapPresentationsDto,
  ) {
    const { presentation1Id, presentation2Id } = swapPresentationsDto;

    const presentation1 = await this.prismaClient.presentation.findUnique({
      where: {
        id: presentation1Id,
      },
    });

    if (!presentation1 || presentation1.presentationBlockId !== id) {
      throw new AppException(
        'Apresentação 1 não foi encontrada nesse bloco',
        400,
      );
    }

    const presentation2 = await this.prismaClient.presentation.findUnique({
      where: {
        id: presentation2Id,
      },
    });

    if (!presentation2 || presentation2.presentationBlockId !== id) {
      throw new AppException(
        'Apresentação 2 não foi encontrada nesse bloco',
        400,
      );
    }

    const presentation1Position = presentation1.positionWithinBlock;
    const presentation2Position = presentation2.positionWithinBlock;

    try {
      await this.prismaClient.$transaction([
        this.prismaClient.presentation.update({
          where: { id: presentation1Id },
          data: { positionWithinBlock: presentation2Position },
        }),
        this.prismaClient.presentation.update({
          where: { id: presentation2Id },
          data: { positionWithinBlock: presentation1Position },
        }),
      ]);
      return {
        message: 'Apresentações trocadas com sucesso',
      };
    } catch {
      throw new AppException('Erro interno na troca de apresentações', 500);
    }
  }

  private calculatePresentationStartTime(
    blockStartTime: Date,
    positionWithinBlock: number,
    presentationDuration: number,
  ): Date {
    const presentationTime = new Date(blockStartTime);
    presentationTime.setMinutes(
      presentationTime.getMinutes() +
        positionWithinBlock * presentationDuration,
    );

    return presentationTime;
  }

  private async processPresentationBlock(presentationBlock: any) {
    // Fetch the associated event edition to get presentation duration
    const eventEdition = await this.prismaClient.eventEdition.findUnique({
      where: {
        id: presentationBlock.eventEditionId,
      },
    });

    if (!eventEdition) {
      throw new AppException('Edição do evento não encontrada', 404);
    }

    const presentationDuration = eventEdition.presentationDuration;

    // For 'General' type blocks, return without calculations
    if (presentationBlock.type !== 'Presentation') {
      return {
        ...presentationBlock,
        presentations: [],
        availablePositionsWithinBlock: [],
      };
    }

    // Calculate total and available positions
    const totalPositions = Math.floor(
      presentationBlock.duration / presentationDuration,
    );

    const occupiedPositions = presentationBlock.presentations.map(
      (p: any) => p.positionWithinBlock,
    );

    const availablePositionsWithinBlock = [];

    for (let i = 0; i < totalPositions; i++) {
      if (!occupiedPositions.includes(i)) {
        const positionStartTime = new Date(presentationBlock.startTime);
        positionStartTime.setMinutes(
          positionStartTime.getMinutes() + i * presentationDuration,
        );

        availablePositionsWithinBlock.push({
          positionWithinBlock: i,
          startTime: positionStartTime,
        });
      }
    }

    // Calculate start times for existing presentations
    const presentationsWithStartTime = presentationBlock.presentations.map(
      (presentation: any) => {
        const startTime = this.calculatePresentationStartTime(
          presentationBlock.startTime,
          presentation.positionWithinBlock,
          presentationDuration,
        );

        return {
          ...presentation,
          startTime,
        };
      },
    );

    return {
      ...presentationBlock,
      presentations: presentationsWithStartTime,
      availablePositionsWithinBlock,
    };
  }
}
