import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateEventRequestDTO,
  EventResponseDTO,
  UpdateEventRequestDTO,
} from './event.dto';

@Injectable()
export class EventService {
  constructor(private prismaClient: PrismaService) {}

  async create(createEvent: CreateEventRequestDTO) {
    const createdEvent = await this.prismaClient.event.create({
      data: createEvent,
    });

    const eventResponseDto = new EventResponseDTO(createdEvent);

    return eventResponseDto;
  }

  async getAll() {
    const events = await this.prismaClient.event.findMany({});

    const eventsResponseDto = events.map(
      (event) => new EventResponseDTO(event),
    );

    console.log(eventsResponseDto);

    return eventsResponseDto;
  }

  async getById(id: number) {
    const event = await this.prismaClient.event.findUnique({
      where: {
        id,
      },
    });

    if (!event) {
      throw new BadRequestException(
        'Não existe nenhum evento com esse identificador',
      );
    }

    const eventResponseDto = new EventResponseDTO(event);

    return eventResponseDto;
  }

  async update(id: number, updateEvent: UpdateEventRequestDTO) {
    const event = await this.prismaClient.event.findUnique({
      where: {
        id,
      },
    });

    if (!event) {
      throw new BadRequestException(
        'Não existe nenhum evento com esse identificador',
      );
    }
    const updatedEvent = await this.prismaClient.event.update({
      where: {
        id,
      },
      data: updateEvent,
    });

    const eventResponseDto = new EventResponseDTO(updatedEvent);

    return eventResponseDto;
  }

  async setActive(id: number) {
    const event = await this.prismaClient.event.findUnique({
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
        await prisma.event.updateMany({
          where: {
            isActive: true,
            id: { not: id },
          },
          data: { isActive: false },
        });

        const updatedEvent = await prisma.event.update({
          where: { id },
          data: { isActive: true },
        });

        return updatedEvent;
      },
    );
    const eventResponseDto = new EventResponseDTO(updatedEvent);

    return eventResponseDto;
  }

  async delete(id: number) {
    const event = await this.prismaClient.event.findUnique({
      where: {
        id,
      },
    });

    if (!event) {
      throw new BadRequestException(
        'Não existe nenhum evento com esse identificador',
      );
    }
    const deletedEvent = await this.prismaClient.event.delete({
      where: {
        id,
      },
    });

    const eventResponseDto = new EventResponseDTO(deletedEvent);

    return eventResponseDto;
  }
}
