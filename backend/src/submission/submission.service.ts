import { Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { AppException } from '../exceptions/app.exception';
import { PrismaService } from '../prisma/prisma.service';
import { SubmissionStatus } from '@prisma/client';
import { Profile } from '@prisma/client';


@Injectable()
export class SubmissionService {
  constructor(private prismaClient: PrismaService) { }

  async create(createSubmissionDto: CreateSubmissionDto) {
    const { advisorId,
      mainAuthorId,
      eventEditionId,
      title, abstractText,
      pdfFile,
      phoneNumber,
      status,
      coAdvisor } = createSubmissionDto;

    const users = await this.prismaClient.userAccount.findMany({
      where: {
        OR: [
          { id: advisorId },
          { id: mainAuthorId },
        ],
      },
    });

    const advisorExists = users.some(user => user.id === advisorId && user.profile === Profile.Professor);
    const mainAuthorExists = users.some(user => user.id === mainAuthorId);

    if (advisorId && !advisorExists) {
      throw new AppException('Orientador não encontrado.', 404);
    }

    if (mainAuthorId && !mainAuthorExists) {
      throw new AppException('Autor principal não encontrado.', 404);
    }

    const mainAuthorAlreadySubmitted = await this.prismaClient.submission.findFirst({
      where: {
        mainAuthorId,
        eventEditionId,
      },
    });

    if (mainAuthorAlreadySubmitted) {
      throw new AppException('Autor principal já submeteu uma apresentação para esta edição do evento.', 400);
    }

    const eventEditionExists = await this.prismaClient.eventEdition.findUnique({
      where: { id: eventEditionId },
    });

    if (!eventEditionExists) {
      throw new AppException('Edição do evento não encontrada.', 404);
    }

    const submissionStatus = status || SubmissionStatus.Submitted;

    const createdSubmission = await this.prismaClient.submission.create({
      data: {
        advisorId,
        mainAuthorId,
        eventEditionId,
        title,
        abstract: abstractText,
        pdfFile,
        phoneNumber,
        status: submissionStatus,
        coAdvisor, 
      },
    });

    return createdSubmission;
  }

  async findAllByEventEditionId(eventEditionId: string) {
    return await this.prismaClient.submission.findMany({
      where: {
        eventEditionId,
      },
    });
}

  async findOne(id: string) {
    const submission = await this.prismaClient.submission.findUnique({
        where: { id },
    });

    if (!submission) throw new AppException('Submissão não encontrada.', 404);

    return submission;
  }

  async update(id: string, updateSubmissionDto: UpdateSubmissionDto) {
    const { advisorId, mainAuthorId, eventEditionId, title, abstractText, pdfFile, phoneNumber, status, coAdvisor } = updateSubmissionDto;

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

      const mainAuthorAlreadySubmitted = await this.prismaClient.submission.findFirst({
        where: {
          mainAuthorId,
          eventEditionId: existingSubmission.eventEditionId,
          NOT: { id },
        },
      });

      if (mainAuthorAlreadySubmitted) {
        throw new AppException('Autor principal já submeteu uma apresentação para esta edição do evento.', 400);
      }
    }

    if (eventEditionId) {
      const eventEditionExists = await this.prismaClient.eventEdition.findUnique({
        where: { id: eventEditionId },
      });
      if (!eventEditionExists) {
        throw new AppException('Edição do evento não encontrada.', 404);
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
}
