import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventEditionDto } from './dto/create-event-edition.dto';
import { EventEditionResponseDto } from './dto/event-edition-response';
import { UpdateEventEditionDto } from './dto/upddate-event-edition.dto';

@Injectable()
export class EventEditionService {
  constructor(private prismaClient: PrismaService) {}

  async create(createEventEditionDto: CreateEventEditionDto) {
    const createdEventEdition = await this.prismaClient.eventEdition.create({
      data: createEventEditionDto,
    });

    const eventResponseDto = new EventEditionResponseDto(createdEventEdition);

    return eventResponseDto;
  }

  async getAll() {
    const events = await this.prismaClient.eventEdition.findMany({});

    const eventsResponseDto = events.map(
      (event) => new EventEditionResponseDto(event),
    );

    return eventsResponseDto;
  }

  async getById(id: string) {
    const event = await this.prismaClient.eventEdition.findUnique({
      where: {
        id,
      },
    });

    if (!event) {
      throw new BadRequestException(
        'Não existe nenhum evento com esse identificador',
      );
    }

    const eventResponseDto = new EventEditionResponseDto(event);

    return eventResponseDto;
  }

  async update(id: string, updateEventEdition: UpdateEventEditionDto) {
    const event = await this.prismaClient.eventEdition.findUnique({
      where: {
        id,
      },
    });

    if (!event) {
      throw new BadRequestException(
        'Não existe nenhum evento com esse identificador',
      );
    }
    const updatedEvent = await this.prismaClient.eventEdition.update({
      where: {
        id,
      },
      data: updateEventEdition,
    });

    const eventResponseDto = new EventEditionResponseDto(updatedEvent);

    return eventResponseDto;
  }

  async setActive(id: string) {
    const event = await this.prismaClient.eventEdition.findUnique({
      where: {
        id,
      },
    });

    if (!event) {
      throw new BadRequestException(
        'Não existe nenhum evento com esse identificador',
      );
    }
    const updatedEvent = await this.prismaClient.$transaction(
      async (prisma) => {
        await prisma.eventEdition.updateMany({
          where: {
            isActive: true,
            id: { not: id },
          },
          data: { isActive: false },
        });

        const updatedEvent = await prisma.eventEdition.update({
          where: { id },
          data: { isActive: true },
        });

        return updatedEvent;
      },
    );
    const eventResponseDto = new EventEditionResponseDto(updatedEvent);

    return eventResponseDto;
  }

  async delete(id: string) {
    const event = await this.prismaClient.eventEdition.findUnique({
      where: {
        id,
      },
    });

    if (!event) {
      throw new BadRequestException(
        'Não existe nenhum evento com esse identificador',
      );
    }
    const deletedEvent = await this.prismaClient.eventEdition.delete({
      where: {
        id,
      },
    });

    const eventResponseDto = new EventEditionResponseDto(deletedEvent);

    return eventResponseDto;
  }
}
