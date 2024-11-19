import { Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { CoAuthorDto } from './dto/co-author.dto';
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
      linkedinUrl,
      status,
      coAuthors } = createSubmissionDto;

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
        linkedinUrl,
        status: submissionStatus,
        CoAuthor: {
          create: (coAuthors || []).map(coAuthor => ({
            name: coAuthor.name,
            institution: coAuthor.institution,
          })),
        },
      },
      include: {
        CoAuthor: true,
      },
    });

    return createdSubmission;
  }

  async findAll() {
    return await this.prismaClient.submission.findMany({
        include: {
            CoAuthor: true,  
        },
    });
}

  async findOne(id: string) {
    const submission = await this.prismaClient.submission.findUnique({
        where: { id },
        include: {
            CoAuthor: true,
        },
    });

    if (!submission) throw new AppException('Submissão não encontrada.', 404);

    return submission;
  }

  async update(id: string, updateSubmissionDto: UpdateSubmissionDto) {
    const { advisorId, mainAuthorId, eventEditionId, title, abstractText, pdfFile, phoneNumber, linkedinUrl, status } = updateSubmissionDto;

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
        linkedinUrl,
        status: submissionStatus,
      },
    });
  }

  async updateCoAuthors(submissionId: string, coAuthors: CoAuthorDto[]) {
    const submissionExists = await this.prismaClient.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submissionExists) {
      throw new AppException('Submissão não encontrada.', 404);
    }

    await this.prismaClient.coAuthor.deleteMany({
      where: { submisionId: submissionId },
    });


    return await this.prismaClient.coAuthor.createMany({
      data: coAuthors.map((coAuthor) => ({
        submisionId: submissionId,
        name: coAuthor.name,
        institution: coAuthor.institution,
      })),
    });
  }

  async remove(id: string) {
    const submissionExists = await this.prismaClient.submission.findUnique({
      where: { id },
    });

    if (!submissionExists) {
      throw new AppException('Submissão não encontrada.', 404);
    }

    await this.prismaClient.submission.delete({
      where: { id },
    });

    return { message: 'Apresentação removida com sucesso.' };

  }
}