import { Injectable } from '@nestjs/common';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { CreatePresentationWithSubmissionDto } from './dto/create-presentation-with-submission.dto';
import { SubmissionService } from '../submission/submission.service';
import { AppException } from '../exceptions/app.exception';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { UpdatePresentationWithSubmissionDto } from './dto/update-presentation-with-submission.dto';
import { PresentationStatus } from '@prisma/client';
import { SubmissionStatus } from '@prisma/client';
import { PresentationBlockType } from '@prisma/client';

@Injectable()
export class PresentationService {
  constructor(
    private prismaClient: PrismaService,
    private submissionService: SubmissionService,
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

    const submissionIsConfirmed =
      submissionExists.status === SubmissionStatus.Confirmed;

    if (!submissionIsConfirmed) {
      throw new AppException('Submissão não confirmada.', 400);
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
      submissionStatus,
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
        status: submissionStatus,
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
        submission: true,
      },
    });

    return presentations;
  }

  async findOne(id: string) {
    const presentation = await this.prismaClient.presentation.findUnique({
      where: { id },
      include: {
        submission: true,
      },
    });

    if (!presentation)
      throw new AppException('Apresentação não encontrada.', 404);
    return presentation;
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
      submissionStatus,
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
          status: submissionStatus,
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
        submissionId: updatedSubmission.id,
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
}
