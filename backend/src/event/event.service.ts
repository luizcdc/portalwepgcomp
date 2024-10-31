import { Injectable } from '@nestjs/common';
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

    const eventResponseDto = new EventResponseDTO(event);

    return eventResponseDto;
  }

  async update(id: number, updateEvent: UpdateEventRequestDTO) {
    const updatedEvent = await this.prismaClient.event.update({
      where: {
        id,
      },
      data: updateEvent,
    });

    const eventResponseDto = new EventResponseDTO(updatedEvent);

    return eventResponseDto;
  }
}
