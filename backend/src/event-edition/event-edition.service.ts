import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateEventEditionDto,
  CreateFromEventEditionFormDto,
} from './dto/create-event-edition.dto';
import { EventEditionResponseDto } from './dto/event-edition-response';

import {
  UpdateEventEditionDto,
  UpdateFromEventEditionFormDto,
} from './dto/update-event-edition.dto';
import { CommitteeLevel, CommitteeRole, Prisma, UserLevel } from '@prisma/client';
import { Cron } from '@nestjs/schedule';
import { ScoringService } from '../scoring/scoring.service';
import { AppException } from '../exceptions/app.exception';

@Injectable()
export class EventEditionService {
  constructor(
    private prismaClient: PrismaService,
    private scoringService: ScoringService,
  ) {}

  async create(createEventEditionDto: CreateEventEditionDto) {
    return this.prismaClient.$transaction(async (prisma) => {
      const currentYear = new Date().getFullYear();

      const existingCurrentYearEvent = await prisma.eventEdition.findFirst({
        where: {
          startDate: {
            gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
          },
        },
      });

      if (existingCurrentYearEvent) {
        throw new AppException(
          `Já existe um evento criado para o ano ${currentYear}.`,
          400,
        );
      }

      const activeEvent = await prisma.eventEdition.findFirst({
        where: {
          isActive: true,
        },
        orderBy: {
          startDate: 'desc',
        },
      });

      if (activeEvent) {
        // Desativa o evento atualmente ativo
        await prisma.eventEdition.update({
          where: { id: activeEvent.id },
          data: { isActive: false },
        });
      }

      const { evaluationCriteria, rooms } =
        await this.defineEvaluationCriteriaAndRooms(
          activeEvent,
          prisma,
          createEventEditionDto,
        );

      if (!createEventEditionDto.submissionStartDate) {
        createEventEditionDto.submissionStartDate = new Date();
      }
      this.validateSubmissionPeriod(createEventEditionDto);

      const createdEventEdition = await prisma.eventEdition.create({
        data: {
          name: createEventEditionDto.name,
          description: createEventEditionDto.description,
          callForPapersText:
            createEventEditionDto.callForPapersText ||
            activeEvent?.callForPapersText ||
            '',
          partnersText:
            createEventEditionDto.partnersText ||
            activeEvent?.partnersText ||
            '',
          location: createEventEditionDto.location,
          startDate: createEventEditionDto.startDate,
          endDate: createEventEditionDto.endDate,
          submissionDeadline: createEventEditionDto.submissionDeadline,
          submissionStartDate: createEventEditionDto.submissionStartDate,
          isEvaluationRestrictToLoggedUsers:
            createEventEditionDto.isEvaluationRestrictToLoggedUsers,
          presentationDuration: createEventEditionDto.presentationDuration,
          presentationsPerPresentationBlock:
            createEventEditionDto.presentationsPerPresentationBlock,
          isActive: true,
        },
      });

      // Copy evaluation criteria if they exist
      if (evaluationCriteria != null && evaluationCriteria.length > 0) {
        await Promise.all(
          evaluationCriteria.map(async (criteria) =>
            prisma.evaluationCriteria.create({
              data: {
                eventEditionId: createdEventEdition.id,
                title: criteria.title,
                description: criteria.description,
                weightRadio: criteria.weightRadio,
              },
            }),
          ),
        );
      }

      // Copy rooms if they exist
      if (rooms != null && rooms.length > 0) {
        await Promise.all(
          rooms.map(async (room) => {
            if (!room.name) {
              throw new AppException('Room name is missing.', 400);
            }
            await prisma.room.create({
              data: {
                eventEditionId: createdEventEdition.id,
                name: room.name,
                description: room.description || '', // Fallback para descrição
              },
            });
          }),
        );
      }

      if (createEventEditionDto.coordinatorId) {
        const coordinator = await prisma.userAccount.findUnique({
          where: {
            id: createEventEditionDto.coordinatorId,
          },
        });
        if (coordinator !== null) {
          await prisma.committeeMember.create({
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
      await this.scoringService.scheduleEventFinalScoresRecalculation(
        createdEventEdition,
      );
      return eventResponseDto;
    });
  }

  private async defineEvaluationCriteriaAndRooms(
    activeEvent: { id: string } | null,
    prisma: Prisma.TransactionClient,
    createEventEditionDto: CreateEventEditionDto,
  ) {
    const evaluationCriteria = activeEvent
      ? await prisma.evaluationCriteria.findMany({
          where: {
            eventEditionId: activeEvent.id,
          },
        })
      : [];
  
    const rooms = activeEvent
      ? createEventEditionDto.roomName
        ? [{ name: createEventEditionDto.roomName, description: '' }]
        : await prisma.room.findMany({
            where: { eventEditionId: activeEvent.id },
            select: { name: true, description: true },
          })
      : [{ name: createEventEditionDto.roomName || 'Auditório Principal', description: '' }];
  
    return { evaluationCriteria, rooms };
  }
  

  private validateSubmissionPeriod(
    createEventEditionDto: CreateEventEditionDto | UpdateEventEditionDto,
  ) {
    let submissionDeadline = createEventEditionDto.submissionDeadline;
    if (submissionDeadline) {
      submissionDeadline =
        submissionDeadline instanceof Date
          ? submissionDeadline
          : new Date(submissionDeadline);
    } else if (createEventEditionDto.startDate) {
      submissionDeadline = createEventEditionDto.startDate;
    }

    if (submissionDeadline && submissionDeadline <= new Date()) {
      throw new BadRequestException(
        'O fim do período de submissão deve ser no futuro.',
      );
    } else if (
      submissionDeadline &&
      createEventEditionDto.startDate &&
      submissionDeadline > createEventEditionDto.startDate
    ) {
      throw new BadRequestException(
        'O fim do período de submissão deve ser anterior ao início do evento.',
      );
    }

    if (createEventEditionDto.submissionStartDate) {
      const submissionStartDate =
        createEventEditionDto.submissionStartDate instanceof Date
          ? createEventEditionDto.submissionStartDate
          : new Date(createEventEditionDto.submissionStartDate);

      if (submissionDeadline && submissionStartDate >= submissionDeadline) {
        throw new BadRequestException(
          'A data de início do período de submissão deve ser anterior ao fim do período de submissão.',
        );
      }
    }
  }

  async validateUniqueCommitteeMembers(
    createFromEventEditionFormDto: CreateFromEventEditionFormDto,
  ): Promise<void> {
    const {
      organizingCommitteeIds,
      itSupportIds,
      administrativeSupportIds,
      communicationIds,
    } = createFromEventEditionFormDto;

    // Agrupa todos os IDs em um único array
    const allIds = [
      ...(organizingCommitteeIds || []),
      ...(itSupportIds || []),
      ...(administrativeSupportIds || []),
      ...(communicationIds || []),
    ];

    // Verifica se há duplicações
    const duplicates = allIds.filter(
      (id, index) => allIds.indexOf(id) !== index,
    );

    if (duplicates.length > 0) {
      throw new BadRequestException(
        //`Os seguintes IDs de usuários estão atribuídos a mais de um cargo: ${[...new Set(duplicates)].join(', ')}.`,
        `Um usuário só pode assumir um cargo na comissão organizadora.`,
      );
    }
  }

  async createFromEventEditionForm(
    createFromEventEditionFormDto: CreateFromEventEditionFormDto,
  ): Promise<EventEditionResponseDto> {
    // Valida os IDs antes de criar o evento
    await this.validateUniqueCommitteeMembers(createFromEventEditionFormDto);

    const eventEdition = await this.create(createFromEventEditionFormDto);

    const { id: eventEditionId } = eventEdition;
    const {
      organizingCommitteeIds,
      itSupportIds,
      administrativeSupportIds,
      communicationIds,
    } = createFromEventEditionFormDto;

    await this.createCommitteeMembersFromArray(
      eventEditionId,
      organizingCommitteeIds,
      CommitteeRole.OrganizingCommittee,
    );

    await this.createCommitteeMembersFromArray(
      eventEditionId,
      itSupportIds,
      CommitteeRole.ITSupport,
    );

    await this.createCommitteeMembersFromArray(
      eventEditionId,
      administrativeSupportIds,
      CommitteeRole.AdministativeSupport,
    );

    await this.createCommitteeMembersFromArray(
      eventEditionId,
      communicationIds,
      CommitteeRole.Communication,
    );

    const eventResponseDto = new EventEditionResponseDto(eventEdition);

    return eventResponseDto;
  }

  async createCommitteeMembersFromArray(
    eventEditionId: string,
    ids: Array<string>,
    role: CommitteeRole,
  ) {
    if (!ids?.length) return;

    await Promise.all(
      ids.map(async (id) => {
        const existingMember =
          await this.prismaClient.committeeMember.findUnique({
            where: {
              eventEditionId_userId: {
                eventEditionId: eventEditionId,
                userId: id,
              },
            },
          });

        if (existingMember) {
          throw new BadRequestException(
            'Um usuário só pode assumir um cargo na comissão organizadora.',
          );
        }

        const committeeMember = await this.prismaClient.committeeMember.create({
          data: {
            eventEditionId: eventEditionId,
            userId: id,
            level: CommitteeLevel.Committee,
            role,
          },
        });

        if (committeeMember) {
          await this.updateUserLevel(id, committeeMember.level);
        }
      }),
    );
  }

  private async updateUserLevel(
    userId: string,
    committeeLevel: CommitteeLevel,
  ) {
    // logic to update user level based in committeLevel
    const userLevel =
      committeeLevel === CommitteeLevel.Coordinator
        ? UserLevel.Superadmin
        : UserLevel.Admin;

    await this.prismaClient.userAccount.update({
      where: { id: userId },
      data: {
        level: userLevel,
      },
    });
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

  async getByYear(year: number) {
    const event = await this.prismaClient.eventEdition.findFirst({
      where: {
        startDate: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Não há eventos para o ano informado');
    }

    const eventResponseDto = new EventEditionResponseDto(event);

    return eventResponseDto;
  }

  async findActive() {
    const event = await this.prismaClient.eventEdition.findFirst({
      where: {
        isActive: true,
      },
    });

    if (!event) {
      throw new BadRequestException('Não existe nenhum evento ativo');
    }

    const eventResponseDto = new EventEditionResponseDto(event);

    return eventResponseDto;
  }

  async updateFromEventEditionForm(
    id: string,
    updateFromEventEditionFormDto: UpdateFromEventEditionFormDto,
  ): Promise<EventEditionResponseDto> {
    const updatedEvent = await this.update(id, updateFromEventEditionFormDto);

    const {
      organizingCommitteeIds,
      itSupportIds,
      administrativeSupportIds,
      communicationIds,
      coordinatorId,
    } = updateFromEventEditionFormDto;

    this.validateSubmissionPeriod(updateFromEventEditionFormDto);

    if (coordinatorId) {
      const coordinator = await this.prismaClient.userAccount.findUnique({
        where: {
          id: coordinatorId,
        },
      });

      if (coordinator !== null) {
        // Remove all roles for the user in this event edition
        await this.prismaClient.committeeMember.deleteMany({
          where: {
            eventEditionId: id,
            userId: coordinatorId,
          },
        });

        // Remove existing coordinator if any
        await this.prismaClient.committeeMember.deleteMany({
          where: {
            eventEditionId: id,
            level: CommitteeLevel.Coordinator,
            role: CommitteeRole.OrganizingCommittee,
          },
        });

        // Add new coordinator
        await this.prismaClient.committeeMember.create({
          data: {
            eventEditionId: id,
            userId: coordinatorId,
            level: CommitteeLevel.Coordinator,
            role: CommitteeRole.OrganizingCommittee,
          },
        });

        // Update user level for the new coordinator
        await this.updateUserLevel(coordinatorId, CommitteeLevel.Coordinator);
      }
    }

    await this.updateCommitteeMembersFromArray(
      id,
      organizingCommitteeIds,
      CommitteeRole.OrganizingCommittee,
    );

    await this.updateCommitteeMembersFromArray(
      id,
      itSupportIds,
      CommitteeRole.ITSupport,
    );

    await this.updateCommitteeMembersFromArray(
      id,
      administrativeSupportIds,
      CommitteeRole.AdministativeSupport,
    );

    await this.updateCommitteeMembersFromArray(
      id,
      communicationIds,
      CommitteeRole.Communication,
    );

    const eventResponseDto = new EventEditionResponseDto(updatedEvent);

    return eventResponseDto;
  }

  async updateCommitteeMembersFromArray(
    eventEditionId: string,
    ids: Array<string>,
    role: CommitteeRole,
  ) {
    if (!ids || !ids.length) return;

    await Promise.all(
      ids.map(async (id) => {
        const committeeMember = await this.prismaClient.committeeMember.upsert({
          where: {
            eventEditionId_userId: {
              eventEditionId,
              userId: id,
            },
          },
          update: {
            role,
          },
          create: {
            eventEditionId,
            userId: id,
            level: CommitteeLevel.Committee,
            role,
          },
        });

        // Update user level when a new committee member is added
        if (committeeMember) {
          await this.updateUserLevel(id, committeeMember.level);
        }
      }),
    );
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
    this.validateSubmissionPeriod(updateEventEdition);
    const fieldsToIgnore = [
      'organizingCommitteeIds',
      'itSupportIds',
      'administrativeSupportIds',
      'communicationIds',
      'coordinatorId',
    ];

    const filteredData = Object.fromEntries(
      Object.entries(updateEventEdition).filter(
        ([key, value]) => value !== undefined && !fieldsToIgnore.includes(key),
      ),
    );

    const updatedEvent = await this.prismaClient.eventEdition.update({
      where: {
        id,
      },
      data: filteredData,
    });

    const eventResponseDto = new EventEditionResponseDto(updatedEvent);

    await this.scoringService.handleEventUpdate(updatedEvent.id);

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
    return this.prismaClient.$transaction(async (prisma) => {
      const eventToDelete = await prisma.eventEdition.findUnique({
        where: { id },
      });
  
      if (!eventToDelete) {
        throw new BadRequestException(
          'Não existe nenhum evento com esse identificador',
        );
      }
  
      const deletedEvent = await prisma.eventEdition.delete({
        where: { id },
      });
  
      // Caso o evento deletado fosse ativo, reativar o evento anterior
      if (eventToDelete.isActive) {
        const previousEvent = await prisma.eventEdition.findFirst({
          where: {
            startDate: { lt: eventToDelete.startDate },
          },
          orderBy: { startDate: 'desc' },
        });
  
        if (previousEvent) {
          await prisma.eventEdition.update({
            where: { id: previousEvent.id },
            data: { isActive: true },
          });
        }
      }
  
      return new EventEditionResponseDto(deletedEvent);
    });
  }

  // Define cron job to run daily at midnight
  @Cron('0 0 * * *')
  async removeAdminsFromEndedEvents() {
    const now = new Date();

    const endedEvents = await this.prismaClient.eventEdition.findMany({
      where: {
        endDate: {
          lte: now,
        },
      },
      select: {
        id: true,
      },
    });

    if (endedEvents.length === 0) {
      console.log('Nenhum evento finalizado encontrado.');
      return;
    }

    const eventIds = endedEvents.map((event) => event.id);

    const adminsToRemove = await this.prismaClient.committeeMember.findMany({
      where: {
        eventEditionId: { in: eventIds },
        level: CommitteeLevel.Committee,
      },
      select: {
        userId: true,
      },
    });

    if (adminsToRemove.length === 0) {
      console.log('Nenhum administrador encontrado.');
      return;
    }

    const adminIds = adminsToRemove.map((admin) => admin.userId);

    await this.prismaClient.userAccount.updateMany({
      where: {
        id: { in: adminIds },
        level: { not: UserLevel.Superadmin },
      },
      data: {
        level: UserLevel.Default,
      },
    });

    console.log(`${adminIds.length} usuários atualizados para nível Default.`);
  }
}
