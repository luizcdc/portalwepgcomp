import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { EventEditionService } from './event-edition.service';
import { BadRequestException } from '@nestjs/common';
import { CreateEventEditionDto } from './dto/create-event-edition.dto';
import { UpdateEventEditionDto } from './dto/upddate-event-edition.dto';
import { EventEditionResponseDto } from './dto/event-edition-response';

describe('EventEditionService', () => {
  let service: EventEditionService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    eventEdition: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updateMany: jest.fn(),
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
        url: 'https://example.com',
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
