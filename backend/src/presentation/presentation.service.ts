import { Injectable } from '@nestjs/common';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { AppException } from '../exceptions/app.exception';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { PresentationStatus } from '@prisma/client';


@Injectable()
export class PresentationService {
  constructor(private prismaClient: PrismaService) { }

  async create(createPresentationDto: CreatePresentationDto) {
    const { submissionId, presentationBlockId, positionWithinBlock, status } = createPresentationDto;

    const duplicatePresentation = await this.prismaClient.presentation.findFirst({
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
    })

    if (!submissionExists) {
      throw new AppException('Submissão não encontrada.', 404);
    }

    const presentationBlockExists = await this.prismaClient.presentationBlock.findUnique({
      where: {
        id: presentationBlockId,
      },
    })

    if (!presentationBlockExists) {
      throw new AppException('Bloco de apresentação não encontrado.', 404);
    }

    const presentationOverlaps = await this.prismaClient.presentation.findFirst({
      where: {
        presentationBlockId: presentationBlockId,
        positionWithinBlock: positionWithinBlock,
      },
    });

    if (presentationOverlaps) {
      throw new AppException('Posição de apresentação já ocupada.', 400);
    }

    const presentationStatus = status || PresentationStatus.ToPresent;

    const createdPresentation = await this.prismaClient.presentation.create({
      data: {
        ...createPresentationDto,
        status: presentationStatus
      },
    });

    return createdPresentation;
  }

  async findAll() {
    return await this.prismaClient.presentation.findMany();
  }

  async findOne(id: string) {
    const presentation = await this.prismaClient.presentation.findUnique({
      where: { id },
    });

    if (!presentation) throw new AppException('Apresentação não encontrada.', 404);
    return presentation;
  }

  async update(id: string, updatePresentationDto: UpdatePresentationDto) {
    const { submissionId, presentationBlockId, positionWithinBlock, status } = updatePresentationDto;

    const existingPresentation = await this.prismaClient.presentation.findUnique({
      where: { id },
    });

    const duplicatePresentation = await this.prismaClient.presentation.findFirst({
      where: {
        submissionId: submissionId,
      },
    });

    if (duplicatePresentation) {
      throw new AppException('Apresentação já cadastrada.', 400);
    }

    if (!existingPresentation) throw new AppException('Apresentação não encontrada.', 404);

    if (submissionId) {
      const submissionExists = await this.prismaClient.submission.findUnique({
        where: {
          id: submissionId,
        },
      })

      if (!submissionExists) {
        throw new AppException('Submissão não encontrada.', 404);
      }
    }

    if (presentationBlockId) {
      const presentationBlockExists = await this.prismaClient.presentationBlock.findUnique({
        where: {
          id: presentationBlockId,
        },
      })

      if (!presentationBlockExists) {
        throw new AppException('Bloco de apresentação não encontrado.', 404);
      }
    }

    if (positionWithinBlock) {
      const presentationOverlaps = await this.prismaClient.presentation.findFirst({
        where: {
          presentationBlockId: presentationBlockId,
          positionWithinBlock: positionWithinBlock,
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

  async remove(id: string) {
    const existingPresentation = await this.prismaClient.presentation.findUnique({
      where: { id },
    });
    if (!existingPresentation) throw new AppException('Apresentação não encontrada.', 404);

    await this.prismaClient.presentation.delete({
      where: { id },
    });

    return { message: 'Apresentação removida com sucesso.' };
  }
}
