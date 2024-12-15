import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { EventEditionService } from './event-edition.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateEventEditionDto } from './dto/create-event-edition.dto';
import { UpdateEventEditionDto } from './dto/update-event-edition.dto';
import { EventEditionResponseDto } from './dto/event-edition-response';

describe('EventEditionService', () => {
  let service: EventEditionService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    eventEdition: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updateMany: jest.fn(),
    },
    userAccount: {
      findUnique: jest.fn(),
    },
    committeeMember: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventEditionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EventEditionService>(EventEditionService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an event edition and return it', async () => {
      const createDto = new CreateEventEditionDto();
      Object.assign(createDto, {
        name: 'Event 1',
        description: 'Description 1',
        callForPapersText: 'Text',
        partnersText: 'Partners',
        location: 'Location 1',
        startDate: new Date(),
        endDate: new Date(),
        submissionDeadline: new Date(),
        presentationDuration: 30,
        presentationsPerPresentationBlock: 2,
      });

      const createdEvent = {
        id: '1',
        ...createDto,
        isActive: false,
        isEvaluationRestrictToLoggedUsers: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.eventEdition.create.mockResolvedValue(createdEvent);

      const result = await service.create(createDto);
      expect(result).toEqual(new EventEditionResponseDto(createdEvent));
      expect(mockPrismaService.eventEdition.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
    it('should create an event edition and a committee member if coordinatorId is provided', async () => {
      const createDto = new CreateEventEditionDto();
      Object.assign(createDto, {
        name: 'Event with Coordinator',
        description: 'Event description',
        callForPapersText: 'Call for Papers',
        partnersText: 'Partners',
        location: 'Location 2',
        startDate: new Date(),
        endDate: new Date(),
        submissionDeadline: new Date(),
        presentationDuration: 45,
        presentationsPerPresentationBlock: 3,
        coordinatorId: 'coordinator123',
      });

      const createdEvent = {
        id: '2',
        ...createDto,
        isActive: false,
        isEvaluationRestrictToLoggedUsers: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const coordinator = { id: 'coordinator123', name: 'Coordinator Name' };

      mockPrismaService.eventEdition.create.mockResolvedValue(createdEvent);
      mockPrismaService.userAccount.findUnique.mockResolvedValue(coordinator);
      mockPrismaService.committeeMember.create.mockResolvedValue({
        id: 'committee123',
        eventEditionId: '2',
        userId: 'coordinator123',
        level: 'Coordinator',
        role: 'OrganizingCommittee',
      });

      const result = await service.create(createDto);

      expect(result).toEqual(new EventEditionResponseDto(createdEvent));
      expect(mockPrismaService.eventEdition.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Event with Coordinator',
        }),
      });
      expect(mockPrismaService.userAccount.findUnique).toHaveBeenCalledWith({
        where: { id: 'coordinator123' },
      });
      expect(mockPrismaService.committeeMember.create).toHaveBeenCalledWith({
        data: {
          eventEditionId: '2',
          userId: 'coordinator123',
          level: 'Coordinator',
          role: 'OrganizingCommittee',
        },
      });
    });
    it('should create an event edition without creating a committee member if coordinatorId is invalid', async () => {
      const createDto = new CreateEventEditionDto();
      Object.assign(createDto, {
        name: 'Event without Valid Coordinator',
        coordinatorId: 'invalid123',
      });

      const createdEvent = {
        id: '3',
        ...createDto,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.eventEdition.create.mockResolvedValue(createdEvent);
      mockPrismaService.userAccount.findUnique.mockResolvedValue(null);

      const result = await service.create(createDto);

      expect(result).toEqual(new EventEditionResponseDto(createdEvent));
      expect(mockPrismaService.eventEdition.create).toHaveBeenCalled();
      expect(mockPrismaService.userAccount.findUnique).toHaveBeenCalledWith({
        where: { id: 'invalid123' },
      });
      expect(mockPrismaService.committeeMember.create).not.toHaveBeenCalled();
    });

    it('should handle Prisma errors gracefully', async () => {
      const createDto = new CreateEventEditionDto();
      Object.assign(createDto, {
        name: 'Event With Error',
        description: 'Event description',
      });

      mockPrismaService.eventEdition.create.mockRejectedValue(
        new Error('Database Error'),
      );

      await expect(service.create(createDto)).rejects.toThrow('Database Error');

      expect(mockPrismaService.eventEdition.create).toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should return all event editions', async () => {
      const events = [
        {
          id: '1',
          name: 'Event 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Event 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPrismaService.eventEdition.findMany.mockResolvedValue(events);

      const result = await service.getAll();
      expect(result).toEqual(
        events.map((event) => new EventEditionResponseDto(event)),
      );
      expect(mockPrismaService.eventEdition.findMany).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return an event by ID', async () => {
      const event = {
        id: '1',
        name: 'Event 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.eventEdition.findUnique.mockResolvedValue(event);

      const result = await service.getById('1');
      expect(result).toEqual(new EventEditionResponseDto(event));
      expect(mockPrismaService.eventEdition.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw an error if event not found', async () => {
      mockPrismaService.eventEdition.findUnique.mockResolvedValue(null);

      await expect(service.getById('1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getByYear', () => {
    it('should return an event for the given year', async () => {
      const year = 2022;
      const event = {
        id: '1',
        name: 'Event 1',
        startDate: new Date(year, 0, 1),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.eventEdition.findFirst.mockResolvedValue(event);

      const result = await service.getByYear(year);

      expect(result).toEqual(new EventEditionResponseDto(event));
      expect(mockPrismaService.eventEdition.findFirst).toHaveBeenCalledWith({
        where: {
          startDate: {
            gte: new Date(year, 0, 1),
            lt: new Date(year + 1, 0, 1),
          },
        },
      });
    });

    it('should throw a NotFoundException when no event is found for the given year', async () => {
      const year = 2022;
      mockPrismaService.eventEdition.findFirst.mockResolvedValue(null);

      await expect(service.getByYear(year)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.eventEdition.findFirst).toHaveBeenCalledWith({
        where: {
          startDate: {
            gte: new Date(year, 0, 1),
            lt: new Date(year + 1, 0, 1),
          },
        },
      });
    });
  });

  describe('update', () => {
    it('should update an event and return it', async () => {
      const event = { id: '1', name: 'Event 1' };
      const updateDto = new UpdateEventEditionDto();
      Object.assign(updateDto, { name: 'Updated Event' });

      const updatedEvent = { ...event, ...updateDto };
      mockPrismaService.eventEdition.findUnique.mockResolvedValue(event);
      mockPrismaService.eventEdition.update.mockResolvedValue(updatedEvent);

      const result = await service.update('1', updateDto);
      expect(result).toEqual(new EventEditionResponseDto(updatedEvent));
    });

    it('should throw an error if event not found', async () => {
      mockPrismaService.eventEdition.findUnique.mockResolvedValue(null);

      await expect(
        service.update('1', new UpdateEventEditionDto()),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('setActive', () => {
    it('should set the event as active and deactivate others', async () => {
      const event = { id: '1', name: 'Event 1', isActive: false };
      const updatedEvent = { ...event, isActive: true };
      mockPrismaService.eventEdition.findUnique.mockResolvedValue(event);
      mockPrismaService.$transaction.mockImplementation(async (cb) =>
        cb(prismaService),
      );

      mockPrismaService.eventEdition.updateMany.mockResolvedValue({});
      mockPrismaService.eventEdition.update.mockResolvedValue(updatedEvent);

      const result = await service.setActive('1');
      expect(result).toEqual(new EventEditionResponseDto(updatedEvent));
    });

    it('should throw an error if event not found', async () => {
      mockPrismaService.eventEdition.findUnique.mockResolvedValue(null);

      await expect(service.setActive('1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete an event and return it', async () => {
      const event = { id: '1', name: 'Event 1' };
      mockPrismaService.eventEdition.findUnique.mockResolvedValue(event);
      mockPrismaService.eventEdition.delete.mockResolvedValue(event);

      const result = await service.delete('1');
      expect(result).toEqual(new EventEditionResponseDto(event));
    });

    it('should throw an error if event not found', async () => {
      mockPrismaService.eventEdition.findUnique.mockResolvedValue(null);

      await expect(service.delete('1')).rejects.toThrow(BadRequestException);
    });
  });
});
