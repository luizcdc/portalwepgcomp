import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { PresentationBlockService } from './presentation-block.service';
import { PresentationBlockType } from '@prisma/client';
import { AppException } from '../exceptions/app.exception';

describe('PresentationBlockService', () => {
  let service: PresentationBlockService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PresentationBlockService,
        {
          provide: PrismaService,
          useValue: {
            presentationBlock: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            eventEdition: {
              findUnique: jest.fn(),
            },
            room: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PresentationBlockService>(PresentationBlockService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an AppException if event edition not found', async () => {
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        service.create({
          // eventEditionId is uuid
          eventEditionId: '123',
          startTime: new Date(),
          duration: 1,
          type: PresentationBlockType.General,
        }),
      ).rejects.toThrow(new AppException('Event edition not found', 404));
    });

    it('should throw an AppException if room not found', async () => {
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({});
      prismaService.room.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        service.create({
          eventEditionId: '123',
          startTime: new Date(),
          duration: 1,
          type: PresentationBlockType.General,
          roomId: '123',
        }),
      ).rejects.toThrow(new AppException('Room not found', 404));
    });
    it('should throw an AppException if presentation block starts before event edition starts', async () => {
      const now = new Date();
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        startDate: new Date(now.getTime() + 1),
      });

      await expect(
        service.create({
          eventEditionId: '123',
          startTime: now,
          duration: 5,
          type: PresentationBlockType.General,
        }),
      ).rejects.toThrow(
        new AppException(
          'Presentation block start date is before event edition start date',
          400,
        ),
      );
    });

    it('should throw an AppException if presentation block starts is after event edition ends', async () => {
      const now = new Date();
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        startDate: new Date(now.getTime() - 2),
        endDate: new Date(now.getTime() - 1),
      });

      await expect(
        service.create({
          eventEditionId: '123',
          startTime: now,
          duration: 5,
          type: PresentationBlockType.General,
        }),
      ).rejects.toThrow(
        new AppException(
          'Presentation block starts after event edition end date',
          400,
        ),
      );
    });
    it('should throw an AppException if presentation block ends after event edition ends', async () => {
      const now = new Date();
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        startDate: new Date(now.getTime() - 2),
        endDate: new Date(now.getTime() + 1),
      });

      await expect(
        service.create({
          eventEditionId: '123',
          startTime: now,
          duration: 5,
          type: PresentationBlockType.General,
        }),
      ).rejects.toThrow(
        new AppException(
          'Presentation block end date is after event edition end date',
          400,
        ),
      );
    });
    it('should create a presentation block', async () => {
      const now = new Date();
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        startDate: new Date(now.getTime() - 2),
        endDate: new Date(now.getTime() + 5 * 60 * 1000),
      });
      prismaService.room.findUnique = jest.fn().mockResolvedValue({});

      const presentationBlock = {
        id: '1',
        eventEditionId: '123',
        startTime: now,
        duration: 5,
        type: PresentationBlockType.General,
      };

      prismaService.presentationBlock.create = jest
        .fn()
        .mockResolvedValue(presentationBlock);

      const result = await service.create({
        eventEditionId: '123',
        startTime: now,
        duration: 5,
        type: PresentationBlockType.General,
        roomId: '123',
      });

      expect(result).toEqual(presentationBlock);
    });
    it('should create a presentation block without a room', async () => {
      const now = new Date();
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        startDate: new Date(now.getTime() - 2),
        endDate: new Date(now.getTime() + 5 * 60 * 1000),
      });

      const presentationBlock = {
        id: '1',
        eventEditionId: '123',
        startTime: now,
        duration: 5,
        type: PresentationBlockType.General,
      };
      prismaService.presentationBlock.create = jest
        .fn()
        .mockResolvedValue(presentationBlock);

      const result = await service.create({
        eventEditionId: '123',
        startTime: now,
        duration: 5,
        type: PresentationBlockType.General,
      });

      expect(result).toEqual(presentationBlock);
    });
    it('should create a presentation block of the type General', async () => {
      const now = new Date();
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        startDate: new Date(now.getTime() - 2),
        endDate: new Date(now.getTime() + 5 * 60 * 1000),
      });

      const presentationBlock = {
        id: '1',
        eventEditionId: '123',
        startTime: now,
        duration: 5,
        type: PresentationBlockType.General,
      };
      prismaService.presentationBlock.create = jest
        .fn()
        .mockResolvedValue(presentationBlock);

      const result = await service.create({
        eventEditionId: '123',
        startTime: now,
        duration: 5,
        type: PresentationBlockType.General,
      });

      expect(result).toEqual(presentationBlock);
    });
    it('should create a presentation block of the type Presentation', async () => {
      const now = new Date();
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        startDate: new Date(now.getTime() - 2),
        endDate: new Date(now.getTime() + 5 * 60 * 1000),
      });

      const presentationBlock = {
        id: '1',
        eventEditionId: '123',
        startTime: now,
        duration: 5,
        type: PresentationBlockType.Presentation,
      };
      prismaService.presentationBlock.create = jest
        .fn()
        .mockResolvedValue(presentationBlock);

      const result = await service.create({
        eventEditionId: '123',
        startTime: now,
        duration: 5,
        type: PresentationBlockType.Presentation,
      });

      expect(result).toEqual(presentationBlock);
    });
  });

  describe('findAllByEventEditionId', () => {
    it('should return all presentation blocks of an event edition id', async () => {
      const eventEditionId = '123';
      const presentationBlocks = [
        {
          id: '1',
          eventEditionId,
          startTime: new Date(),
          duration: 1,
          type: PresentationBlockType.General,
        },
        {
          id: '2',
          eventEditionId,
          startTime: new Date(),
          duration: 1,
          type: PresentationBlockType.General,
        },
      ];
      prismaService.presentationBlock.findMany = jest
        .fn()
        .mockResolvedValue(presentationBlocks);

      const result = await service.findAllByEventEditionId(eventEditionId);

      expect(result).toEqual(presentationBlocks);
    });
    it('should return an empty array if no presentation blocks are found', async () => {
      const eventEditionId = '123';
      prismaService.presentationBlock.findMany = jest
        .fn()
        .mockResolvedValue([]);

      const result = await service.findAllByEventEditionId(eventEditionId);

      expect(result).toEqual([]);
    });
    it('should return only presentation blocks of the event edition id', async () => {
      const eventEditionId = '123';
      const presentationBlocks = [
        {
          id: '1',
          eventEditionId,
          startTime: new Date(),
          duration: 1,
          type: PresentationBlockType.General,
        },
        {
          id: '2',
          eventEditionId: '456',
          startTime: new Date(),
          duration: 1,
          type: PresentationBlockType.General,
        },
        {
          id: '3',
          eventEditionId,
          startTime: new Date(),
          duration: 1,
          type: PresentationBlockType.General,
        },
      ];

      prismaService.presentationBlock.findMany = jest
        .fn()
        .mockResolvedValue([presentationBlocks[0], presentationBlocks[2]]);

      const result = await service.findAllByEventEditionId(eventEditionId);

      expect(prismaService.presentationBlock.findMany).toHaveBeenCalledWith({
        where: {
          eventEditionId,
        },
      });

      // Verify the result is correct
      expect(result).toEqual([presentationBlocks[0], presentationBlocks[2]]);
    });
  });

  describe('findOne', () => {
    it('should return a presentation block by id', async () => {
      const presentationBlock = {
        id: '1',
        eventEditionId: '123',
        startTime: new Date(),
        duration: 1,
        type: PresentationBlockType.General,
      };
      prismaService.presentationBlock.findUnique = jest
        .fn()
        .mockResolvedValue(presentationBlock);

      const result = await service.findOne('1');

      expect(result).toEqual(presentationBlock);
    });
  });

  describe('update', () => {
    it('should update a presentation block', async () => {
      const presentationBlock = {
        id: '1',
        eventEditionId: '123',
        startTime: new Date(),
        duration: 1,
        type: PresentationBlockType.General,
      };
      prismaService.presentationBlock.update = jest
        .fn()
        .mockResolvedValue(presentationBlock);

      const result = await service.update('1', {
        startTime: new Date(),
        duration: 1,
        type: PresentationBlockType.General,
      });

      expect(result).toEqual(presentationBlock);
    });
  });

  describe('remove', () => {
    it('should remove a presentation block', async () => {
      prismaService.presentationBlock.delete = jest.fn().mockResolvedValue({});

      const result = await service.remove('1');

      expect(prismaService.presentationBlock.delete).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      });

      expect(result).toEqual({});
    });
  });
});
