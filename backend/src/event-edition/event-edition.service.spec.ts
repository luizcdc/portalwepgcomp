import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { EventEditionService } from './event-edition.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateEventEditionDto } from './dto/create-event-edition.dto';
import { UpdateEventEditionDto } from './dto/update-event-edition.dto';
import { EventEditionResponseDto } from './dto/event-edition-response';

const oneDay = 24 * 60 * 60 * 1000;
const today = new Date();

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
    evaluationCriteria: {
      create: jest.fn(),
      findMany: jest.fn(),
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
      mockPrismaService.$transaction.mockImplementation(async (cb) =>
        cb(prismaService),
      );
      const createDto = new CreateEventEditionDto();
      Object.assign(createDto, {
        name: 'Event 1',
        description: 'Description 1',
        callForPapersText: 'Text',
        partnersText: 'Partners',
        location: 'Location 1',
        startDate: new Date(today.getTime() + 7 * oneDay),
        endDate: new Date(today.getTime() + 8 * oneDay),
        submissionStartDate: new Date(today.getTime() + 3 * oneDay),
        submissionDeadline: new Date(today.getTime() + 5 * oneDay),
        presentationDuration: 30,
        presentationsPerPresentationBlock: 2,
      });

      const createdEvent = {
        id: '1',
        ...createDto,
        isActive: false,
        isEvaluationRestrictToLoggedUsers: false,
        createdAt: today,
        updatedAt: today,
      };
      mockPrismaService.eventEdition.create.mockResolvedValue(createdEvent);

      const result = await service.create(createDto);
      expect(result).toEqual(new EventEditionResponseDto(createdEvent));
      expect(mockPrismaService.eventEdition.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          isActive: true,
        },
      });
    });

    it('should create an event edition and a committee member if coordinatorId is provided', async () => {
      mockPrismaService.$transaction.mockImplementation(async (cb) =>
        cb(prismaService),
      );
      const createDto = new CreateEventEditionDto();
      Object.assign(createDto, {
        name: 'Event with Coordinator',
        description: 'Event description',
        callForPapersText: 'Call for Papers',
        partnersText: 'Partners',
        location: 'Location 2',
        startDate: new Date(today.getTime() + 7 * oneDay),
        endDate: new Date(today.getTime() + 8 * oneDay),
        submissionDeadline: new Date(today.getTime() + 5 * oneDay),
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
      mockPrismaService.$transaction.mockImplementation(async (cb) =>
        cb(prismaService),
      );
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
      mockPrismaService.$transaction.mockImplementation(async (cb) =>
        cb(prismaService),
      );
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

    it('should copy evaluation criteria from the most recent active event', async () => {
      mockPrismaService.$transaction.mockImplementation(async (cb) =>
        cb(prismaService),
      );
      const createDto = new CreateEventEditionDto();
      Object.assign(createDto, {
        name: 'Event with Criteria',
        description: 'Event description',
        callForPapersText: 'Call for Papers',
        partnersText: 'Partners',
        location: 'Location 3',
        startDate: new Date(today.getTime() + 7 * oneDay),
        endDate: new Date(today.getTime() + 8 * oneDay),
        submissionDeadline: new Date(today.getTime() + 5 * oneDay),
        presentationDuration: 60,
        presentationsPerPresentationBlock: 4,
      });

      const activeEvent = {
        id: 'activeEventId',
        name: 'Active Event',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const evaluationCriteria = [
        {
          id: 'criteria1',
          eventEditionId: 'activeEventId',
          title: 'Criteria 1',
          description: 'Description 1',
          weightRadio: 1,
        },
        {
          id: 'criteria2',
          eventEditionId: 'activeEventId',
          title: 'Criteria 2',
          description: 'Description 2',
          weightRadio: 2,
        },
      ];

      const createdEvent = {
        id: '4',
        ...createDto,
        isActive: false,
        isEvaluationRestrictToLoggedUsers: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.eventEdition.findFirst.mockResolvedValue(activeEvent);
      mockPrismaService.evaluationCriteria.findMany.mockResolvedValue(
        evaluationCriteria,
      );
      mockPrismaService.eventEdition.create.mockResolvedValue(createdEvent);

      const result = await service.create(createDto);

      expect(result).toEqual(new EventEditionResponseDto(createdEvent));
      expect(mockPrismaService.eventEdition.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Event with Criteria',
        }),
      });
      expect(
        mockPrismaService.evaluationCriteria.findMany,
      ).toHaveBeenCalledWith({
        where: { eventEditionId: 'activeEventId' },
      });
      expect(mockPrismaService.evaluationCriteria.create).toHaveBeenCalledTimes(
        2,
      );
      expect(mockPrismaService.evaluationCriteria.create).toHaveBeenCalledWith({
        data: {
          eventEditionId: '4',
          title: 'Criteria 1',
          description: 'Description 1',
          weightRadio: 1,
        },
      });
      expect(mockPrismaService.evaluationCriteria.create).toHaveBeenCalledWith({
        data: {
          eventEditionId: '4',
          title: 'Criteria 2',
          description: 'Description 2',
          weightRadio: 2,
        },
      });
    });

    it('should not copy evaluation criteria if no active event exists', async () => {
      mockPrismaService.$transaction.mockImplementation(async (cb) =>
        cb(prismaService),
      );
      const createDto = new CreateEventEditionDto();
      Object.assign(createDto, {
        name: 'Event without Active Event',
        description: 'Event description',
        callForPapersText: 'Call for Papers',
        partnersText: 'Partners',
        location: 'Location 4',
        startDate: new Date(today.getTime() + 7 * oneDay),
        endDate: new Date(today.getTime() + 8 * oneDay),
        submissionDeadline: new Date(today.getTime() + 5 * oneDay),
        presentationDuration: 60,
        presentationsPerPresentationBlock: 4,
      });

      const createdEvent = {
        id: '5',
        ...createDto,
        isActive: false,
        isEvaluationRestrictToLoggedUsers: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.eventEdition.findFirst.mockResolvedValue(null);
      mockPrismaService.eventEdition.create.mockResolvedValue(createdEvent);

      const result = await service.create(createDto);

      expect(result).toEqual(new EventEditionResponseDto(createdEvent));
      expect(mockPrismaService.eventEdition.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Event without Active Event',
        }),
      });

      expect(
        mockPrismaService.evaluationCriteria.create,
      ).not.toHaveBeenCalled();
    });
    // TODO: three more tests: can't have submissionDeadline after eventStartDate, can't have submissionDeadline in the past,
    // can't have submissionStartDate after submissionDeadline
    it('should throw error when submissionDeadline is after eventStartDate', async () => {
      mockPrismaService.$transaction.mockImplementation(async (cb) =>
        cb(prismaService),
      );
      const createDto = new CreateEventEditionDto();
      Object.assign(createDto, {
        name: 'Invalid Event',
        startDate: new Date(today.getTime() + 3 * oneDay),
        submissionDeadline: new Date(today.getTime() + 5 * oneDay),
      });

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockPrismaService.eventEdition.create).not.toHaveBeenCalled();
    });

    it('should throw error when submissionDeadline is in the past', async () => {
      mockPrismaService.$transaction.mockImplementation(async (cb) =>
        cb(prismaService),
      );
      const createDto = new CreateEventEditionDto();
      Object.assign(createDto, {
        name: 'Invalid Event',
        submissionDeadline: new Date(today.getTime() - oneDay),
      });

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockPrismaService.eventEdition.create).not.toHaveBeenCalled();
    });

    it('should throw error when submissionStartDate is after submissionDeadline', async () => {
      mockPrismaService.$transaction.mockImplementation(async (cb) =>
        cb(prismaService),
      );
      const createDto = new CreateEventEditionDto();
      Object.assign(createDto, {
        name: 'Invalid Event',
        submissionStartDate: new Date(today.getTime() + 5 * oneDay),
        submissionDeadline: new Date(today.getTime() + 3 * oneDay),
      });

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockPrismaService.eventEdition.create).not.toHaveBeenCalled();
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
