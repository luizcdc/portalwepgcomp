import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { CreatePresentationWithSubmissionDto } from './dto/create-presentation-with-submission.dto';
import { SubmissionService } from '../submission/submission.service';
import { ScoringService } from '../scoring/scoring.service';
import { AppException } from '../exceptions/app.exception';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { UpdatePresentationWithSubmissionDto } from './dto/update-presentation-with-submission.dto';
import { PresentationStatus, Profile } from '@prisma/client';
import { SubmissionStatus } from '@prisma/client';
import { PresentationBlockType } from '@prisma/client';
import { PresentationResponseDto } from './dto/response-presentation.dto';
import {
  BookmarkedPresentationResponseDto,
  BookmarkedPresentationsResponseDto,
  BookmarkPresentationRequestDto,
  BookmarkPresentationResponseDto,
} from './dto/bookmark-presentation.dto';
import { ListAdvisedPresentationsResponse } from './dto/list-advised-presentations.dto';

@Injectable()
export class PresentationService {
  private readonly logger = new Logger(PresentationService.name);

  constructor(
    private prismaClient: PrismaService,
    private submissionService: SubmissionService,
    private scoringService: ScoringService,
  ) {}

  async create(createPresentationDto: CreatePresentationDto) {
    const { submissionId, presentationBlockId, positionWithinBlock, status } =
      createPresentationDto;

    const duplicatePresentation =
      await this.prismaClient.presentation.findFirst({
        where: {
          submissionId: submissionId,
        },
      });

    if (duplicatePresentation) {
      throw new AppException('Apresentação já cadastrada.', 400);
    }

    const submissionExists = await this.prismaClient.submission.findUnique({
      where: {
        id: submissionId,
      },
    });

    if (!submissionExists) {
      throw new AppException('Submissão não encontrada.', 404);
    }

    // turn submission status to confirmed
    if (submissionExists.status !== SubmissionStatus.Confirmed) {
      await this.submissionService.update(submissionId, {
        status: SubmissionStatus.Confirmed,
      });
    }

    const presentationBlockExists =
      await this.prismaClient.presentationBlock.findUnique({
        where: {
          id: presentationBlockId,
          type: PresentationBlockType.Presentation,
        },
      });

    if (!presentationBlockExists) {
      throw new AppException('Bloco de apresentação não encontrado.', 404);
    }

    // Fetch the presentation block duration and event edition's presentation duration
    const eventEdition = await this.prismaClient.eventEdition.findUnique({
      where: { id: presentationBlockExists.eventEditionId },
    });

    if (!eventEdition) {
      throw new AppException('Evento não encontrado.', 404);
    }

    const blockDuration = presentationBlockExists.duration;
    const presentationDuration = eventEdition.presentationDuration;

    const maxPositionWithinBlock =
      Math.floor(blockDuration / presentationDuration) - 1;
    if (positionWithinBlock > maxPositionWithinBlock) {
      throw new AppException('Posição de apresentação inválida.', 400);
    }

    const presentationOverlaps = await this.prismaClient.presentation.findFirst(
      {
        where: {
          presentationBlockId: presentationBlockId,
          positionWithinBlock: positionWithinBlock,
        },
      },
    );

    if (presentationOverlaps) {
      throw new AppException('Posição de apresentação já ocupada.', 400);
    }

    const presentationStatus = status || PresentationStatus.ToPresent;

    const createdPresentation = await this.prismaClient.presentation.create({
      data: {
        ...createPresentationDto,
        status: presentationStatus,
      },
    });

    return createdPresentation;
  }

  async createWithSubmission(
    createPresentationWithSubmissionDto: CreatePresentationWithSubmissionDto,
  ) {
    const {
      advisorId,
      mainAuthorId,
      eventEditionId,
      title,
      abstractText,
      pdfFile,
      phoneNumber,
      coAdvisor,
      presentationBlockId,
      positionWithinBlock,
      status,
    } = createPresentationWithSubmissionDto;

    // Attempt to create the submission
    let createdSubmission;
    try {
      createdSubmission = await this.submissionService.create({
        advisorId,
        mainAuthorId,
        eventEditionId,
        title,
        abstractText,
        pdfFile,
        phoneNumber,
        proposedPresentationBlockId: presentationBlockId,
        proposedPositionWithinBlock: positionWithinBlock,
        status: SubmissionStatus.Confirmed,
        coAdvisor,
      });
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException('Erro ao criar a submissão.', 500);
    }

    // Check if presentationBlockId and positionWithinBlock are provided
    if (!presentationBlockId || positionWithinBlock === undefined) {
      return {
        submission: createdSubmission,
      };
    }

    // Determine presentation status
    const presentationStatus = status || PresentationStatus.ToPresent;

    // Attempt to create the presentation
    let createdPresentation;
    try {
      createdPresentation = await this.create({
        submissionId: createdSubmission.id,
        presentationBlockId,
        positionWithinBlock,
        status: presentationStatus,
      });
    } catch (error) {
      // Rool back the submission creation
      await this.submissionService.remove(createdSubmission.id);

      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException('Erro ao criar a apresentação.', 500);
    }

    return {
      submission: createdSubmission,
      presentation: createdPresentation,
    };
  }

  async findAllByEventEditionId(eventEditionId: string) {
    const presentations = await this.prismaClient.presentation.findMany({
      where: {
        submission: {
          eventEditionId,
        },
      },
      include: {
        submission: {
          include: {
            mainAuthor: true,
            advisor: true,
          },
        },
      },
    });

    const presentationResponseDtos: PresentationResponseDto[] = [];

    for (const presentation of presentations) {
      const presentationTime = await this.calculatePresentationStartTime(
        presentation.presentationBlockId,
        presentation.positionWithinBlock,
      );

      presentationResponseDtos.push(
        new PresentationResponseDto(presentation, presentationTime),
      );
    }

    return presentationResponseDtos;
  }

  async findOne(id: string) {
    const presentation = await this.prismaClient.presentation.findUnique({
      where: { id },
      include: {
        submission: {
          include: {
            mainAuthor: true,
            advisor: true,
          },
        },
      },
    });

    if (!presentation)
      throw new AppException('Apresentação não encontrada.', 404);

    const presentationTime = await this.calculatePresentationStartTime(
      presentation.presentationBlockId,
      presentation.positionWithinBlock,
    );

    return new PresentationResponseDto(presentation, presentationTime);
  }

  async update(id: string, updatePresentationDto: UpdatePresentationDto) {
    const { submissionId, presentationBlockId, positionWithinBlock } =
      updatePresentationDto;

    const existingPresentation =
      await this.prismaClient.presentation.findUnique({
        where: { id },
      });

    const duplicatePresentation =
      await this.prismaClient.presentation.findFirst({
        where: {
          submissionId: submissionId,
          NOT: { id },
        },
      });

    if (duplicatePresentation) {
      throw new AppException('Apresentação já cadastrada.', 400);
    }

    if (!existingPresentation)
      throw new AppException('Apresentação não encontrada.', 404);

    // Validate submission if it is being updated
    if (submissionId) {
      const submissionExists = await this.prismaClient.submission.findUnique({
        where: {
          id: submissionId,
        },
      });

      if (!submissionExists) {
        throw new AppException('Submissão não encontrada.', 404);
      }

      const submissionIsConfirmed =
        submissionExists.status === SubmissionStatus.Confirmed;

      if (!submissionIsConfirmed) {
        throw new AppException('Submissão não confirmada.', 400);
      }
    }

    // Validate presentation block if it is being updated
    if (presentationBlockId) {
      const presentationBlockExists =
        await this.prismaClient.presentationBlock.findUnique({
          where: {
            id: presentationBlockId,
          },
        });

      if (!presentationBlockExists) {
        throw new AppException('Bloco de apresentação não encontrado.', 404);
      }

      // Fetch the event edition for the block to check the presentation duration
      const eventEdition = await this.prismaClient.eventEdition.findUnique({
        where: { id: presentationBlockExists.eventEditionId },
      });

      if (!eventEdition) {
        throw new AppException('Evento não encontrado.', 404);
      }

      const blockDuration = presentationBlockExists.duration;
      const presentationDuration = eventEdition.presentationDuration;

      // Calculate the max position within the block
      const maxPositionWithinBlock =
        Math.floor(blockDuration / presentationDuration) - 1;
      if (positionWithinBlock > maxPositionWithinBlock) {
        throw new AppException('Posição de apresentação inválida.', 400);
      }
    }

    if (positionWithinBlock) {
      const presentationOverlaps =
        await this.prismaClient.presentation.findFirst({
          where: {
            presentationBlockId: presentationBlockId,
            positionWithinBlock: positionWithinBlock,
            NOT: { id },
          },
        });

      if (presentationOverlaps) {
        throw new AppException('Posição de apresentação já ocupada.', 400);
      }
    }

    const updatedPresentation = await this.prismaClient.presentation.update({
      where: { id },
      data: updatePresentationDto,
    });

    return updatedPresentation;
  }

  async updateWithSubmission(
    id: string,
    updatePresentationWithSubmissionDto: UpdatePresentationWithSubmissionDto,
  ) {
    const {
      advisorId,
      mainAuthorId,
      eventEditionId,
      title,
      abstractText,
      pdfFile,
      phoneNumber,
      coAdvisor,
      presentationBlockId,
      positionWithinBlock,
      status,
    } = updatePresentationWithSubmissionDto;

    const existingPresentation =
      await this.prismaClient.presentation.findUnique({
        where: { id },
      });

    if (!existingPresentation)
      throw new AppException('Apresentação não encontrada.', 404);

    // Attempt to update the submission
    let updatedSubmission;
    try {
      updatedSubmission = await this.submissionService.update(
        existingPresentation.submissionId,
        {
          advisorId,
          mainAuthorId,
          eventEditionId,
          title,
          abstractText,
          pdfFile,
          phoneNumber,
          coAdvisor,
        },
      );
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException('Erro ao atualizar a submissão.', 500);
    }

    // Attempt to update the presentation
    let updatedPresentation;
    try {
      updatedPresentation = await this.update(id, {
        presentationBlockId,
        positionWithinBlock,
        status,
      });
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException('Erro ao atualizar a apresentação.', 500);
    }

    return {
      submission: updatedSubmission,
      presentation: updatedPresentation,
    };
  }

  async remove(id: string) {
    const existingPresentation =
      await this.prismaClient.presentation.findUnique({
        where: { id },
      });
    if (!existingPresentation)
      throw new AppException('Apresentação não encontrada.', 404);

    await this.prismaClient.presentation.delete({
      where: { id },
    });

    return { message: 'Apresentação removida com sucesso.' };
  }

  async listUserPresentations(userId: string) {
    // Fetch submissions created by the logged-in user and include related presentations
    const submissions = await this.prismaClient.submission.findMany({
      where: { mainAuthorId: userId },
      include: { Presentation: true },
    });

    // Extract presentations directly from the submissions
    const presentations = submissions.flatMap(
      (submission) => submission.Presentation,
    );

    return presentations;
  }

  async listAdvisedPresentations(
    userId: string,
  ): Promise<Array<ListAdvisedPresentationsResponse>> {
    const user = await this.prismaClient.userAccount.findUnique({
      where: {
        id: userId,
      },
    });

    if (user.profile !== Profile.Professor) {
      throw new AppException('Usuário não é um professor.', 403);
    }

    const submissions = await this.prismaClient.submission.findMany({
      where: { advisorId: userId },
      include: { Presentation: true },
    });

    return submissions.flatMap((submission) => submission.Presentation);
  }

  async updatePresentationForUser(
    userId: string,
    presentationId: string,
    dto: UpdatePresentationDto,
  ) {
    // Check if the presentation belongs to a submission authored by the user
    const presentation = await this.prismaClient.presentation.findFirst({
      where: {
        id: presentationId,
        submission: { mainAuthorId: userId },
      },
    });

    if (!presentation) {
      throw new AppException(
        'Apresentação não encontrada ou não pertence ao usuário.',
        404,
      );
    }

    // Update the presentation
    return this.prismaClient.presentation.update({
      where: { id: presentationId },
      data: dto,
    });
  }

  private async calculatePresentationStartTime(
    presentationBlockId: string,
    positionWithinBlock: number,
  ): Promise<Date> {
    const presentationBlock =
      await this.prismaClient.presentationBlock.findUnique({
        where: { id: presentationBlockId },
      });

    if (!presentationBlock)
      throw new AppException('Bloco de apresentação não encontrado.', 404);

    const eventEdition = await this.prismaClient.eventEdition.findUnique({
      where: { id: presentationBlock.eventEditionId },
    });

    if (!eventEdition) throw new AppException('Evento não encontrado.', 404);

    const presentationDuration = eventEdition.presentationDuration;
    const startTime = presentationBlock.startTime;

    const presentationTime = new Date(startTime);
    presentationTime.setMinutes(
      presentationTime.getMinutes() +
        positionWithinBlock * presentationDuration,
    );

    return presentationTime;
  }

  async bookmarkPresentation(
    bookmarkPresentationRequestDto: BookmarkPresentationRequestDto,
    userId: string,
  ): Promise<BookmarkPresentationResponseDto> {
    const { presentationId } = bookmarkPresentationRequestDto;

    const user = await this.prismaClient.userAccount.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new AppException('Usuário não encontrado.', 404);
    }

    const presentation = await this.prismaClient.presentation.findUnique({
      where: {
        id: presentationId,
      },
    });

    if (!presentation) {
      throw new AppException('Apresentação não encontrada.', 404);
    }

    const updatedUser = await this.prismaClient.userAccount.update({
      where: {
        id: userId,
      },
      data: {
        bookmarkedPresentations: {
          connect: {
            id: presentation.id,
          },
        },
      },
      include: {
        bookmarkedPresentations: {
          include: {
            submission: {
              include: {
                mainAuthor: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
                advisor: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return new BookmarkPresentationResponseDto(
      updatedUser.bookmarkedPresentations,
    );
  }

  async bookmarkedPresentation(
    userId: string,
    presentationId: string,
  ): Promise<BookmarkedPresentationResponseDto> {
    const user = await this.prismaClient.userAccount.findUnique({
      where: {
        id: userId,
      },
      include: {
        bookmarkedPresentations: {
          where: {
            id: presentationId,
          },
        },
      },
    });

    const bookmarked = !!(user && user.bookmarkedPresentations.length > 0);

    return new BookmarkedPresentationResponseDto(bookmarked);
  }

  async bookmarkedPresentations(
    userId: string,
  ): Promise<BookmarkedPresentationsResponseDto> {
    const user = await this.prismaClient.userAccount.findUnique({
      where: {
        id: userId,
      },
      include: {
        bookmarkedPresentations: {
          include: {
            submission: {
              include: {
                mainAuthor: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
                advisor: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new AppException('Usuário não encontrado.', 404);
    }

    return new BookmarkedPresentationsResponseDto(user.bookmarkedPresentations);
  }

  async removePresentationBookmark(
    presentationId: string,
    userId: string,
  ): Promise<BookmarkedPresentationsResponseDto> {
    const user = await this.prismaClient.userAccount.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new AppException('Usuário não encontrado.', 404);
    }

    const presentation = await this.prismaClient.presentation.findUnique({
      where: {
        id: presentationId,
      },
    });

    if (!presentation) {
      throw new AppException('Apresentação não encontrada.', 404);
    }

    const updatedUser = await this.prismaClient.userAccount.update({
      where: {
        id: userId,
      },
      data: {
        bookmarkedPresentations: {
          disconnect: {
            id: presentation.id,
          },
        },
      },
      include: {
        bookmarkedPresentations: {
          include: {
            submission: {
              include: {
                mainAuthor: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
                advisor: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return new BookmarkedPresentationsResponseDto(
      updatedUser.bookmarkedPresentations,
    );
  }

  async recalculateAllScores(eventEditionId: string): Promise<void> {
    const eventEditionExists = await this.prismaClient.eventEdition.findUnique({
      where: {
        id: eventEditionId,
      },
    });

    if (!eventEditionExists) {
      throw new AppException('Edição do evento não encontrada.', 404);
    }

    await this.scoringService.recalculateAllScores(eventEditionId);
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async calculateScoresForActiveEvent() {
    try {
      this.logger.log('Starting daily score calculation for active event');

      // Find the active event edition
      const activeEventEdition = await this.prismaClient.eventEdition.findFirst(
        {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            endDate: true,
          },
        },
      );

      if (!activeEventEdition) {
        this.logger.warn('No active event edition found');
        return;
      }

      const now = new Date();
      if (activeEventEdition.endDate < now) {
        this.logger.warn(
          `Event ${activeEventEdition.name} has already ended on ${activeEventEdition.endDate.toISOString()}`,
        );
        return;
      }

      // Calculate scores for all presentations in the active event
      await this.recalculateAllScores(activeEventEdition.id);

      this.logger.log(
        `Successfully calculated scores for event: ${activeEventEdition.id}`,
      );
    } catch (error) {
      this.logger.error('Error calculating scores:', error);
    }
  }
}
