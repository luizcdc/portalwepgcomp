import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import { CreatePresentationBlockDto } from './dto/create-presentation-block.dto';
import { UpdatePresentationBlockDto } from './dto/update-presentation-block.dto';

@Injectable()
export class PresentationBlockService {
  constructor(private readonly prismaClient: PrismaService) {}

  async create(createPresentationBlockDto: CreatePresentationBlockDto) {
    const eventEdition = await this.prismaClient.eventEdition.findUnique({
      where: {
        id: createPresentationBlockDto.eventEditionId,
      },
    });

    if (eventEdition == null) {
      throw new AppException('Event edition not found', 404);
    }

    if (createPresentationBlockDto.roomId) {
      const roomExists = await this.prismaClient.room.findUnique({
        where: {
          id: createPresentationBlockDto.roomId,
        },
      });

      if (roomExists == null) {
        throw new AppException('Room not found', 404);
      }
    }

    if (eventEdition.startDate > createPresentationBlockDto.startTime) {
      throw new AppException(
        'Presentation block start date is before event edition start date',
        400,
      );
    }

    if (eventEdition.endDate < createPresentationBlockDto.startTime) {
      throw new AppException(
        'Presentation block end date is after event edition end date',
        400,
      );
    }
    // duration is an int, in minutes. To add the minutes to the DateTime, we need to

    const endTime =
      createPresentationBlockDto.startTime.getTime() +
      createPresentationBlockDto.duration * 1000 * 60;
    const endTimeDate = new Date(endTime);
    if (eventEdition.endDate < endTimeDate) {
      throw new AppException(
        'Presentation block end date is after event edition end date',
        400,
      );
    }

    const createdPresentationBlock =
      await this.prismaClient.presentationBlock.create({
        data: createPresentationBlockDto,
      });

    return createdPresentationBlock;
  }

  async findAll() {
    return `This action returns all presentationBlock`;
  }
  async findAllByEventEditionId(eventEditionId: string) {
    const presentationBlocks =
      await this.prismaClient.presentationBlock.findMany({
        where: {
          eventEditionId,
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
