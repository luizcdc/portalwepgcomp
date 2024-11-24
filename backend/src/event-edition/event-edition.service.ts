import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventEditionDto } from './dto/create-event-edition.dto';
import { EventEditionResponseDto } from './dto/event-edition-response';
import { UpdateEventEditionDto } from './dto/update-event-edition.dto';
import { CommitteeLevel, CommitteeRole } from '@prisma/client';
@Injectable()
export class EventEditionService {
  constructor(private prismaClient: PrismaService) {}

  async create(createEventEditionDto: CreateEventEditionDto) {
    const createdEventEdition = await this.prismaClient.eventEdition.create({
      data: {
        name: createEventEditionDto.name,
        description: createEventEditionDto.description,
        callForPapersText: createEventEditionDto.callForPapersText,
        partnersText: createEventEditionDto.partnersText,
        url: createEventEditionDto.url,
        location: createEventEditionDto.location,
        startDate: createEventEditionDto.startDate,
        endDate: createEventEditionDto.endDate,
        submissionDeadline: createEventEditionDto.submissionDeadline,
        isEvaluationRestrictToLoggedUsers:
          createEventEditionDto.isEvaluationRestrictToLoggedUsers,
        presentationDuration: createEventEditionDto.presentationDuration,
        presentationsPerPresentationBlock:
          createEventEditionDto.presentationsPerPresentationBlock,
      },
    });

    if (createEventEditionDto.coordinatorId) {
      const coordinator = await this.prismaClient.userAccount.findUnique({
        where: {
          id: createEventEditionDto.coordinatorId,
        },
      });
      if (coordinator !== null) {
        await this.prismaClient.committeeMember.create({
          data: {
            eventEditionId: createdEventEdition.id,
            userId: createEventEditionDto.coordinatorId,
            level: CommitteeLevel.Coordinator,
            role: CommitteeRole.OrganizingCommittee,
          },
        });
      }
    }

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
