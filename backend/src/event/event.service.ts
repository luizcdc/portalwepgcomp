import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventRequestDTO } from './event.dto';

@Injectable()
export class EventService {
  constructor(private prismaClient: PrismaService) {}

  async create(createEvent: CreateEventRequestDTO) {
    const createdEvent = await this.prismaClient.event.create({
      data: createEvent,
    });

    return createdEvent;
  }

  async getById(id: number) {
    const event = await this.prismaClient.event.findUnique({
      where: {
        id,
      },
    });

    return event;
  }
}
