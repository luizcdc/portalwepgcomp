import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import { CreatePresentationBlockDto } from './dto/create-presentation-block.dto';
import { UpdatePresentationBlockDto } from './dto/update-presentation-block.dto';
import { PresentationBlockType, PresentationStatus } from '@prisma/client';
import { SwapPresentationsDto } from './dto/swap-presentations.dto';

@Injectable()
export class PresentationBlockService {
  constructor(private readonly prismaClient: PrismaService) {}

  async create(createPresentationBlockDto: CreatePresentationBlockDto) {
    const eventEdition = await this.validateTypeAndEventEdition(
      createPresentationBlockDto,
    );

    await this.validateRoom(createPresentationBlockDto);

    await this.validateAndProcessTime(eventEdition, createPresentationBlockDto);

    const {
      submissions,
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
      submissions &&
      submissions.length > 0 &&
      submissions.length <= numPresentations
    ) {
      const submissionsExist = await this.prismaClient.submission.findMany({
        where: {
          id: {
            in: submissions,
          },
        },
      });
      if (submissionsExist.length !== submissions.length) {
        throw new AppException('Um dos trabalhos informados não existe', 404);
      }
      const submissionsExistIds = submissionsExist.map(
        (submission) => submission.id,
      );
      // make sure they are in the same order
      submissionsExistIds.sort(
        (a, b) => submissions.indexOf(a) - submissions.indexOf(b),
      );
      // for each submission, find the presentation that is tied to it
      const presentations = await this.prismaClient.presentation.findMany({
        where: {
          submissionId: {
            in: submissionsExistIds,
          },
        },
      });
      const submissionsWithoutPresentation = submissionsExistIds.filter(
        (submission) =>
          !presentations.some(
            (presentation) => presentation.submissionId === submission,
          ),
      );
      // now for each presentation, make an update to the positionWithinBlock
      for (const presentation of presentations) {
        await this.prismaClient.presentation.update({
          where: {
            id: presentation.id,
          },
          data: {
            positionWithinBlock: submissionsExistIds.indexOf(
              presentation.submissionId,
            ),
            presentationBlockId: createdPresentationBlock.id,
          },
        });
      }
      // Create presentations for each submission that doesn't have one
      await this.prismaClient.presentation.createMany({
        data: submissionsWithoutPresentation.map((submission) => ({
          submissionId: submission,
          presentationBlockId: createdPresentationBlock.id,
          positionWithinBlock: submissionsExistIds.indexOf(submission),
          status: PresentationStatus.ToPresent,
        })),
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

  private async validateAndProcessTime(
    eventEdition: {
      id: string;
      name: string;
      description: string;
      callForPapersText: string;
      partnersText: string;
      location: string;
      startDate: Date;
      endDate: Date;
      submissionDeadline: Date;
      isActive: boolean;
      isEvaluationRestrictToLoggedUsers: boolean;
      presentationDuration: number;
      presentationsPerPresentationBlock: number;
      createdAt: Date;
      updatedAt: Date;
    },
    createPresentationBlockDto: CreatePresentationBlockDto,
  ) {
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
  }

  private async validateRoom(
    createPresentationBlockDto: CreatePresentationBlockDto,
  ) {
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
  }

  private async validateTypeAndEventEdition(
    createPresentationBlockDto: CreatePresentationBlockDto,
  ) {
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
    if (eventEdition == null) {
      throw new AppException('Edição do evento não encontrada', 404);
    }
    if (typeof createPresentationBlockDto.duration != 'number') {
      createPresentationBlockDto.duration =
        createPresentationBlockDto.numPresentations *
        eventEdition.presentationDuration;
    } else {
      createPresentationBlockDto.numPresentations = 0;
    }
    return eventEdition;
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
    this.validateTypeUpdate(updatePresentationBlockDto);
    const presentationBlock =
      await this.prismaClient.presentationBlock.findUnique({
        where: {
          id,
        },
      });
    if (presentationBlock == null) {
      throw new AppException('Sessão não encontrada', 404);
    }
    if (updatePresentationBlockDto.duration == null) {
      const eventEdition = await this.prismaClient.eventEdition.findUnique({
        where: {
          id: presentationBlock.eventEditionId,
        },
      });
      updatePresentationBlockDto.duration =
        eventEdition.presentationDuration *
        updatePresentationBlockDto.numPresentations;
    }

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      numPresentations,
      submissions,
      panelists,
      ...without_num_presentations
    } = updatePresentationBlockDto;
    // For each submission, do like in this.create() (if it exists, reassign to this presentationBlock, if it doesn't, create the presentation), and update the positionWithinBlock
    // if the lenght == 0, delete all presentations
    if (submissions && submissions.length > 0) {
      // Find existing submissions
      const submissionsExist = await this.prismaClient.submission.findMany({
        where: {
          id: { in: submissions },
        },
      });

      if (submissionsExist.length !== submissions.length) {
        throw new AppException('Um dos trabalhos informados não existe', 404);
      }

      // Sort submissions to maintain order
      const submissionsExistIds = submissionsExist.map((sub) => sub.id);
      submissionsExistIds.sort(
        (a, b) => submissions.indexOf(a) - submissions.indexOf(b),
      );

      // Find existing presentations
      const existingPresentations =
        await this.prismaClient.presentation.findMany({
          where: {
            submissionId: { in: submissionsExistIds },
          },
        });

      // Update existing presentations
      for (const presentation of existingPresentations) {
        await this.prismaClient.presentation.update({
          where: { id: presentation.id },
          data: {
            positionWithinBlock: submissionsExistIds.indexOf(
              presentation.submissionId,
            ),
            presentationBlockId: id,
          },
        });
      }

      // Create new presentations for submissions without one
      const submissionsWithoutPresentation = submissionsExistIds.filter(
        (subId) =>
          !existingPresentations.some((pres) => pres.submissionId === subId),
      );

      if (submissionsWithoutPresentation.length > 0) {
        await this.prismaClient.presentation.createMany({
          data: submissionsWithoutPresentation.map((submissionId) => ({
            submissionId,
            presentationBlockId: id,
            positionWithinBlock: submissionsExistIds.indexOf(submissionId),
            status: PresentationStatus.ToPresent,
          })),
        });
      }
    } else {
      await this.prismaClient.presentation.deleteMany({
        where: {
          presentationBlockId: id,
        },
      });
    }
    // For each panelist (it's an userAccountId), do the same as the submissions: delete all panelists and create new ones
    if (panelists && panelists.length > 0) {
      // delete all panelists currently assigned to this block
      await this.prismaClient.panelist.deleteMany({
        where: {
          presentationBlockId: id,
        },
      });
      // create a panelist for each valid userAccountId
      // validate userIDs
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
          presentationBlockId: id,
        })),
      });
    } else {
      await this.prismaClient.panelist.deleteMany({
        where: {
          presentationBlockId: id,
        },
      });
    }

    return await this.prismaClient.presentationBlock.update({
      where: {
        id,
      },
      data: without_num_presentations,
    });
  }

  private validateTypeUpdate(
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
