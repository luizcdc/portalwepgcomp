import { Injectable } from '@nestjs/common';
import {
  CreateSubmissionDto,
  CreateSubmissionInCurrentEventDto,
} from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { ResponseSubmissionDto } from './dto/response-submission.dto';
import { AppException } from '../exceptions/app.exception';
import { PrismaService } from '../prisma/prisma.service';
import { SubmissionStatus } from '@prisma/client';
import { Profile } from '@prisma/client';
import { Submission } from '@prisma/client';

@Injectable()
export class SubmissionService {
  constructor(private prismaClient: PrismaService) {}

  async create(createSubmissionDto: CreateSubmissionDto) {
    const {
      advisorId,
      mainAuthorId,
      eventEditionId,
      title,
      abstractText,
      pdfFile,
      phoneNumber,
      proposedPresentationBlockId,
      proposedPositionWithinBlock,
      status,
      coAdvisor,
    } = createSubmissionDto;

    const users = await this.prismaClient.userAccount.findMany({
      where: {
        OR: [{ id: advisorId }, { id: mainAuthorId }],
      },
    });

    const advisorExists = users.some(
      (user) => user.id === advisorId && user.profile === Profile.Professor,
    );
    const mainAuthorExists = users.some((user) => user.id === mainAuthorId);

    if (advisorId && !advisorExists) {
      throw new AppException('Orientador não encontrado.', 404);
    }

    if (mainAuthorId && !mainAuthorExists) {
      throw new AppException('Autor principal não encontrado.', 404);
    }

    const mainAuthorAlreadySubmitted =
      await this.prismaClient.submission.findFirst({
        where: {
          mainAuthorId,
          eventEditionId,
        },
      });

    if (mainAuthorAlreadySubmitted) {
      throw new AppException(
        'Autor principal já enviou uma submissão para esta edição do evento.',
        400,
      );
    }

    const eventEditionExists = await this.prismaClient.eventEdition.findUnique({
      where: { id: eventEditionId },
    });

    if (!eventEditionExists) {
      throw new AppException('Edição do evento não encontrada.', 404);
    }

    const submissionDeadline = eventEditionExists.submissionDeadline;
    if (new Date() > submissionDeadline) {
      throw new AppException(
        'O prazo para submissão de trabalhos nessa edição do evento já chegou ao fim.',
        400,
      );
    } else if (new Date() < eventEditionExists.submissionStartDate) {
      throw new AppException(
        `O evento ainda não está aceitando submissões. Por favor, tente novamente no dia do início das submissões: ${eventEditionExists.submissionStartDate}.`,
        400,
      );
    }

    const submissionStatus = status || SubmissionStatus.Submitted;

    const sameTittleExists = await this.prismaClient.submission.findFirst({
      where: {
        title,
        eventEditionId,
      },
    });

    if (sameTittleExists) {
      throw new AppException(
        'Já existe uma submissão com o mesmo título para essa edição do evento.',
        400,
      );
    }

    if (
      proposedPresentationBlockId &&
      proposedPositionWithinBlock !== undefined
    ) {
      const presentationBlockExists =
        await this.prismaClient.presentationBlock.findUnique({
          where: { id: proposedPresentationBlockId },
        });

      if (!presentationBlockExists) {
        throw new AppException('Bloco de apresentação não encontrado.', 404);
      }

      const blockDuration = presentationBlockExists.duration;
      const presentationDuration = eventEditionExists.presentationDuration;

      const maxPositionWithinBlock =
        Math.floor(blockDuration / presentationDuration) - 1;
      if (proposedPositionWithinBlock > maxPositionWithinBlock) {
        throw new AppException('Posição de apresentação inválida.', 400);
      }

      const presentationExists = await this.prismaClient.presentation.findFirst(
        {
          where: {
            presentationBlockId: proposedPresentationBlockId,
            positionWithinBlock: proposedPositionWithinBlock,
          },
        },
      );

      if (presentationExists) {
        throw new AppException(
          'Já existe uma apresentação aceita nesta posição do bloco.',
          400,
        );
      }
    }

    const createdSubmission = await this.prismaClient.submission.create({
      data: {
        advisorId,
        mainAuthorId,
        eventEditionId,
        title,
        abstract: abstractText,
        pdfFile,
        phoneNumber,
        proposedPresentationBlockId,
        proposedPositionWithinBlock,
        status: submissionStatus,
        coAdvisor,
      },
    });

    return createdSubmission;
  }

  async findAll(
    eventEditionId: string,
    withoutPresentation: boolean,
    orderByProposedPresentation: boolean,
    showConfirmedOnly: boolean,
  ): Promise<ResponseSubmissionDto[]> {
    const submissions = await this.prismaClient.submission.findMany({
      where: {
        eventEditionId: eventEditionId,
        ...(withoutPresentation && { Presentation: { none: {} } }),
        ...(showConfirmedOnly && { status: SubmissionStatus.Confirmed }),
      },
      orderBy: orderByProposedPresentation
        ? [
            { proposedPresentationBlockId: { sort: 'asc', nulls: 'last' } },
            { proposedPositionWithinBlock: { sort: 'asc', nulls: 'last' } },
          ]
        : undefined,
    });

    const result: ResponseSubmissionDto[] = [];

    for (const submission of submissions) {
      const proposedStartTime = await this.calculateProposedStartTime(
        submission,
        eventEditionId,
      );

      result.push(new ResponseSubmissionDto(submission, proposedStartTime));
    }

    return result;
  }

  async findOne(id: string): Promise<ResponseSubmissionDto> {
    const submission = await this.prismaClient.submission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new AppException('Submissão não encontrada.', 404);
    }

    const proposedStartTime = await this.calculateProposedStartTime(
      submission,
      submission.eventEditionId,
    );

    return new ResponseSubmissionDto(submission, proposedStartTime);
  }

  async update(id: string, updateSubmissionDto: UpdateSubmissionDto) {
    const {
      advisorId,
      mainAuthorId,
      eventEditionId,
      title,
      abstractText,
      pdfFile,
      phoneNumber,
      proposedPresentationBlockId,
      proposedPositionWithinBlock,
      status,
      coAdvisor,
    } = updateSubmissionDto;

    const existingSubmission = await this.prismaClient.submission.findUnique({
      where: { id },
    });

    if (!existingSubmission) {
      throw new AppException('Submissão não encontrada.', 404);
    }

    if (advisorId) {
      const advisorExists = await this.prismaClient.userAccount.findUnique({
        where: { id: advisorId },
      });
      if (!advisorExists || advisorExists.profile !== Profile.Professor) {
        throw new AppException('Orientador não encontrado.', 404);
      }
    }

    if (mainAuthorId) {
      const mainAuthorExists = await this.prismaClient.userAccount.findUnique({
        where: { id: mainAuthorId },
      });
      if (!mainAuthorExists) {
        throw new AppException('Autor principal não encontrado.', 404);
      }

      const mainAuthorAlreadySubmitted =
        await this.prismaClient.submission.findFirst({
          where: {
            mainAuthorId,
            eventEditionId: existingSubmission.eventEditionId,
            NOT: { id },
          },
        });

      if (mainAuthorAlreadySubmitted) {
        throw new AppException(
          'Autor principal já submeteu uma apresentação para esta edição do evento.',
          400,
        );
      }
    }

    if (title) {
      const sameTittleExists = await this.prismaClient.submission.findFirst({
        where: {
          title,
          eventEditionId: existingSubmission.eventEditionId,
          NOT: { id },
        },
      });

      if (sameTittleExists) {
        throw new AppException(
          'Já existe uma submissão com o mesmo título para essa edição do evento.',
          400,
        );
      }
    }

    if (eventEditionId) {
      const eventEditionExists =
        await this.prismaClient.eventEdition.findUnique({
          where: { id: eventEditionId },
        });
      if (!eventEditionExists) {
        throw new AppException('Edição do evento não encontrada.', 404);
      }
    }

    if (
      proposedPresentationBlockId &&
      proposedPositionWithinBlock !== undefined
    ) {
      const proposedPresentationBlockExists =
        await this.prismaClient.presentationBlock.findUnique({
          where: { id: proposedPresentationBlockId },
        });

      if (!proposedPresentationBlockExists) {
        throw new AppException('Bloco de apresentação não encontrado.', 404);
      }

      // Fetch the event edition for the block to check the presentation duration
      const eventEdition = await this.prismaClient.eventEdition.findUnique({
        where: { id: proposedPresentationBlockExists.eventEditionId },
      });

      if (!eventEdition) {
        throw new AppException('Edição do evento não encontrada.', 404);
      }

      const blockDuration = proposedPresentationBlockExists.duration;
      const presentationDuration = eventEdition.presentationDuration;

      const maxPositionWithinBlock =
        Math.floor(blockDuration / presentationDuration) - 1;
      if (proposedPositionWithinBlock > maxPositionWithinBlock) {
        throw new AppException('Posição de apresentação inválida.', 400);
      }

      const presentationExists = await this.prismaClient.presentation.findFirst(
        {
          where: {
            presentationBlockId: proposedPresentationBlockId,
            positionWithinBlock: proposedPositionWithinBlock,
            NOT: { submissionId: id },
          },
        },
      );

      if (presentationExists) {
        throw new AppException(
          'Já existe uma apresentação aceita nesta posição do bloco.',
          400,
        );
      }
    }

    const submissionStatus = status || SubmissionStatus.Submitted;

    return this.prismaClient.submission.update({
      where: { id },
      data: {
        advisorId,
        mainAuthorId,
        eventEditionId,
        title,
        abstract: abstractText,
        pdfFile,
        phoneNumber,
        proposedPresentationBlockId,
        proposedPositionWithinBlock,
        status: submissionStatus,
        coAdvisor,
      },
    });
  }

  async remove(id: string) {
    const submission = await this.prismaClient.submission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new AppException('Submissão não encontrada.', 404);
    }

    return this.prismaClient.submission.delete({
      where: { id },
    });
  }

  private async calculateProposedStartTime(
    submission: Submission,
    eventEditionId: string,
  ): Promise<Date | null> {
    const eventEdition = await this.prismaClient.eventEdition.findUnique({
      where: { id: eventEditionId },
      select: { presentationDuration: true },
    });

    if (!submission.proposedPresentationBlockId) {
      return null;
    }

    const presentationBlock =
      await this.prismaClient.presentationBlock.findUnique({
        where: { id: submission.proposedPresentationBlockId },
        select: { startTime: true },
      });

    const presentationDurationMinutes = eventEdition?.presentationDuration || 0;
    if (
      !presentationBlock?.startTime ||
      submission.proposedPositionWithinBlock === null ||
      submission.proposedPositionWithinBlock === undefined
    ) {
      return null;
    }

    const proposedStartTime = new Date(presentationBlock.startTime);
    const additionalMinutes =
      submission.proposedPositionWithinBlock * presentationDurationMinutes;

    proposedStartTime.setMinutes(
      proposedStartTime.getMinutes() + additionalMinutes,
    );

    return proposedStartTime;
  }

  async createInCurrentEvent(
    createSubmissionInCurrentEventDto: CreateSubmissionInCurrentEventDto,
  ) {
    const event = await this.prismaClient.eventEdition.findFirst({
      where: {
        isActive: true,
      },
    });

    if (!event) {
      throw new AppException('Não existe nenhum evento ativo no momento.', 404);
    }

    return this.create({
      ...createSubmissionInCurrentEventDto,
      eventEditionId: event.id,
    });
  }
}
