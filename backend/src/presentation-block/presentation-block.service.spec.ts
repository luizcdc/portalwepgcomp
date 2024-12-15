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
            presentation: {
              findMany: jest.fn(),
              updateMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              createMany: jest.fn(),
              deleteMany: jest.fn(),
            },
            submission: {
              findMany: jest.fn(),
            },
            userAccount: {
              findMany: jest.fn(),
            },
            panelist: {
              createMany: jest.fn(),
              findMany: jest.fn(),
              deleteMany: jest.fn(),
              updateMany: jest.fn(),
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
    const baseDate = new Date('2024-01-01T10:00:00Z');
    const validEventEdition = {
      id: '123',
      startDate: new Date('2024-01-01T09:00:00Z'),
      endDate: new Date('2024-01-01T18:00:00Z'),
      presentationDuration: 20,
    };

    beforeEach(() => {
      prismaService.eventEdition.findUnique = jest
        .fn()
        .mockResolvedValue(validEventEdition);
      prismaService.room.findUnique = jest
        .fn()
        .mockResolvedValue({ id: 'room1' });
      prismaService.presentationBlock.findMany = jest
        .fn()
        .mockResolvedValue([]);
      prismaService.presentationBlock.create = jest
        .fn()
        .mockImplementation((data) => ({
          id: 'block1',
          ...data.data,
        }));
    });

    // Validation Tests
    it('should throw AppException if event edition not found', async () => {
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        service.create({
          eventEditionId: '123',
          startTime: baseDate,
          type: PresentationBlockType.General,
          duration: 60,
        }),
      ).rejects.toThrow(
        new AppException('Edição do evento não encontrada', 404),
      );
    });

    it('should throw AppException if room not found', async () => {
      prismaService.room.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        service.create({
          eventEditionId: '123',
          roomId: 'nonexistent',
          startTime: baseDate,
          type: PresentationBlockType.General,
          duration: 60,
        }),
      ).rejects.toThrow(new AppException('Sala não encontrada', 404));
    });

    it('should throw AppException if block starts before event', async () => {
      await expect(
        service.create({
          eventEditionId: '123',
          startTime: new Date('2024-01-01T08:00:00Z'),
          type: PresentationBlockType.General,
          duration: 60,
        }),
      ).rejects.toThrow(
        new AppException(
          'O início da sessão foi marcado para antes do início da edição do evento',
          400,
        ),
      );
    });

    it('should throw AppException if block ends after event', async () => {
      await expect(
        service.create({
          eventEditionId: '123',
          startTime: new Date('2024-01-01T17:30:00Z'),
          type: PresentationBlockType.General,
          duration: 60,
        }),
      ).rejects.toThrow(
        new AppException(
          'O fim da sessão foi marcado para depois do fim da edição do evento',
          400,
        ),
      );
    });

    it('should throw AppException for General block without duration', async () => {
      await expect(
        service.create({
          eventEditionId: '123',
          startTime: baseDate,
          type: PresentationBlockType.General,
        }),
      ).rejects.toThrow(
        new AppException('A duração da sessão geral deve ser informada', 400),
      );
    });

    it('should throw AppException for Presentation block without numPresentations', async () => {
      await expect(
        service.create({
          eventEditionId: '123',
          startTime: baseDate,
          type: PresentationBlockType.Presentation,
        }),
      ).rejects.toThrow(
        new AppException(
          'O número de apresentações deve ser informado para sessões de apresentação',
          400,
        ),
      );
    });

    // Success Tests
    it('should create a General block successfully', async () => {
      const result = await service.create({
        eventEditionId: '123',
        startTime: baseDate,
        type: PresentationBlockType.General,
        duration: 60,
      });

      expect(result).toBeDefined();
      expect(result.duration).toBe(60);
      expect(prismaService.presentationBlock.create).toHaveBeenCalled();
    });

    it('should create a Presentation block with panelists', async () => {
      prismaService.userAccount.findMany = jest
        .fn()
        .mockResolvedValue([{ id: 'user1' }, { id: 'user2' }]);

      const result = await service.create({
        eventEditionId: '123',
        startTime: baseDate,
        type: PresentationBlockType.Presentation,
        numPresentations: 3,
        panelists: ['user1', 'user2'],
      });

      expect(result).toBeDefined();
      expect(prismaService.panelist.createMany).toHaveBeenCalled();
    });

    it('should create a Presentation block with submissions', async () => {
      prismaService.submission.findMany = jest
        .fn()
        .mockResolvedValue([{ id: 'sub1' }, { id: 'sub2' }]);
      prismaService.presentation.findMany = jest
        .fn()
        .mockResolvedValue([{ id: 'presentation1', submissionId: 'sub1' }]);

      const result = await service.create({
        eventEditionId: '123',
        startTime: baseDate,
        type: PresentationBlockType.Presentation,
        numPresentations: 2,
        submissions: ['sub1', 'sub2'],
      });

      expect(result).toBeDefined();
      expect(prismaService.presentation.findMany).toHaveBeenCalled();
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
          presentations: [],
          panelists: [],
        },
        {
          id: '2',
          eventEditionId,
          startTime: new Date(),
          duration: 1,
          type: PresentationBlockType.General,
          presentations: [],
          panelists: [],
        },
      ];

      prismaService.presentationBlock.findMany = jest
        .fn()
        .mockResolvedValue(presentationBlocks);

      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        id: eventEditionId,
        presentationDuration: 10,
        startDate: new Date(),
        endDate: new Date(),
      });

      const result = await service.findAllByEventEditionId(eventEditionId);

      expect(result.length).toBe(2);
      result.forEach((block) => {
        expect(block).toHaveProperty('availablePositionsWithinBlock');
      });
    });
    it('should return presentation blocks with available positions', async () => {
      const eventEditionId = '123';
      const now = new Date();

      const presentationBlocks = [
        {
          id: '1',
          eventEditionId,
          startTime: now,
          duration: 30,
          type: PresentationBlockType.Presentation,
          presentations: [],
        },
        {
          id: '2',
          eventEditionId,
          startTime: now,
          duration: 30,
          type: PresentationBlockType.General,
          presentations: [],
        },
      ];

      prismaService.presentationBlock.findMany = jest
        .fn()
        .mockResolvedValue(presentationBlocks);
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        id: eventEditionId,
        presentationDuration: 10,
      });

      const result = await service.findAllByEventEditionId(eventEditionId);

      expect(result.length).toBe(2);

      // Check Presentation block
      const presentationBlock = result.find(
        (block) => block.type === PresentationBlockType.Presentation,
      );
      expect(presentationBlock).toBeDefined();
      expect(presentationBlock.availablePositionsWithinBlock).toBeDefined();
      expect(presentationBlock.availablePositionsWithinBlock.length).toBe(3); // 30 min / 10 min per presentation
    });
    it('should return an empty array if no presentation blocks are found', async () => {
      const eventEditionId = '123';

      prismaService.presentationBlock.findMany = jest
        .fn()
        .mockResolvedValue([]);

      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        id: eventEditionId,
        presentationDuration: 10,
        startDate: new Date(),
        endDate: new Date(),
      });

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
          presentations: [],
          panelists: [],
        },
        {
          id: '3',
          eventEditionId,
          startTime: new Date(),
          duration: 1,
          type: PresentationBlockType.General,
          presentations: [],
          panelists: [],
        },
      ];

      prismaService.presentationBlock.findMany = jest
        .fn()
        .mockResolvedValue(presentationBlocks);

      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        id: eventEditionId,
        presentationDuration: 10,
        startDate: new Date(),
        endDate: new Date(),
      });

      const result = await service.findAllByEventEditionId(eventEditionId);

      expect(prismaService.presentationBlock.findMany).toHaveBeenCalledWith({
        where: {
          eventEditionId,
        },
        include: {
          presentations: {
            include: {
              submission: true,
            },
          },
          panelists: {
            include: {
              user: true,
            },
          },
        },
      });

      expect(result.length).toBe(2);
    });
    it('should throw an error if event edition is not found', async () => {
      const eventEditionId = '123';

      prismaService.presentationBlock.findMany = jest
        .fn()
        .mockResolvedValue([]);
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        service.findAllByEventEditionId(eventEditionId),
      ).rejects.toThrow('Edição do evento não encontrada');
    });
  });

  describe('findOne', () => {
    it('should return a presentation block by id', async () => {
      const presentationBlock = {
        id: '1',
        eventEditionId: '123',
        startTime: new Date(),
        duration: 30,
        type: PresentationBlockType.Presentation,
        presentations: [],
      };

      prismaService.presentationBlock.findUnique = jest
        .fn()
        .mockResolvedValue(presentationBlock);

      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        id: '123',
        presentationDuration: 10,
        startDate: new Date(),
        endDate: new Date(),
      });

      const result = await service.findOne('1');

      expect(result.id).toBe('1');
      expect(result).toHaveProperty('availablePositionsWithinBlock');
    });

    it('should return a presentation block with available positions', async () => {
      const now = new Date();
      const presentationBlock = {
        id: '1',
        eventEditionId: '123',
        startTime: now,
        duration: 30,
        type: PresentationBlockType.Presentation,
        presentations: [],
      };

      prismaService.presentationBlock.findUnique = jest
        .fn()
        .mockResolvedValue(presentationBlock);
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        id: '123',
        presentationDuration: 10,
      });

      const result = await service.findOne('1');

      expect(result.id).toBe('1');
      expect(result.availablePositionsWithinBlock).toBeDefined();
      expect(result.availablePositionsWithinBlock.length).toBe(3); // 30 min / 10 min per presentation
    });

    it('should return a general block with empty available positions', async () => {
      const now = new Date();
      const presentationBlock = {
        id: '1',
        eventEditionId: '123',
        startTime: now,
        duration: 30,
        type: PresentationBlockType.General,
        presentations: [],
      };

      prismaService.presentationBlock.findUnique = jest
        .fn()
        .mockResolvedValue(presentationBlock);
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        id: '123',
        presentationDuration: 10,
      });

      const result = await service.findOne('1');

      expect(result.id).toBe('1');
      expect(result.availablePositionsWithinBlock).toEqual([]);
    });

    it('should throw an error if presentation block is not found', async () => {
      prismaService.presentationBlock.findUnique = jest
        .fn()
        .mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(
        'Sessão não encontrada',
      );
    });

    it('should throw an error if event edition is not found', async () => {
      const now = new Date();
      const presentationBlock = {
        id: '1',
        eventEditionId: '123',
        startTime: now,
        duration: 30,
        type: PresentationBlockType.Presentation,
        presentations: [],
      };

      prismaService.presentationBlock.findUnique = jest
        .fn()
        .mockResolvedValue(presentationBlock);
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(
        'Edição do evento não encontrada',
      );
    });
  });

  describe('update', () => {
    const existingBlock = {
      id: 'block1',
      eventEditionId: '123',
      type: PresentationBlockType.Presentation,
      duration: 60,
    };

    beforeEach(() => {
      prismaService.presentationBlock.findUnique = jest
        .fn()
        .mockResolvedValue(existingBlock);
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        id: '123',
        presentationDuration: 20,
      });
    });

    // Validation Tests
    it('should throw AppException if block not found', async () => {
      prismaService.presentationBlock.findUnique = jest
        .fn()
        .mockResolvedValue(null);

      await expect(
        service.update('nonexistent', {
          duration: 60,
        }),
      ).rejects.toThrow(new AppException('Sessão não encontrada', 404));
    });

    it('should throw AppException if neither duration nor numPresentations provided', async () => {
      await expect(
        service.update('block1', {
          type: PresentationBlockType.General,
        }),
      ).rejects.toThrow(
        new AppException(
          'É necessário informar a duração da sessão ou o número de apresentações',
          400,
        ),
      );
    });

    it('should throw AppException if both duration and numPresentations provided', async () => {
      await expect(
        service.update('block1', {
          duration: 60,
          numPresentations: 3,
        }),
      ).rejects.toThrow(
        new AppException(
          'Informe ou duração ou número de apresentações, não ambos',
          400,
        ),
      );
    });

    // Success Tests
    it('should update block with new duration', async () => {
      prismaService.presentationBlock.update = jest.fn().mockResolvedValue({
        ...existingBlock,
        duration: 90,
      });

      const result = await service.update('block1', {
        duration: 90,
        type: PresentationBlockType.General,
      });

      expect(result.duration).toBe(90);
      expect(prismaService.presentationBlock.update).toHaveBeenCalled();
    });

    it('should update presentations when submissions change', async () => {
      prismaService.submission.findMany = jest
        .fn()
        .mockResolvedValue([{ id: 'sub1' }, { id: 'sub2' }]);

      prismaService.presentation.findMany = jest
        .fn()
        .mockResolvedValue([{ id: 'presentation1', submissionId: 'sub1' }]);

      prismaService.presentationBlock.update = jest.fn().mockResolvedValue({
        ...existingBlock,
        numPresentations: 2,
        submissions: ['sub1', 'sub2'],
      });

      const result = await service.update('block1', {
        numPresentations: 2,
        submissions: ['sub1', 'sub2'],
      });

      expect(result).toBeDefined();
      expect(prismaService.presentation.findMany).toHaveBeenCalled();
    });

    it('should update panelists', async () => {
      prismaService.userAccount.findMany = jest
        .fn()
        .mockResolvedValue([{ id: 'user1' }, { id: 'user2' }]);

      prismaService.panelist.findMany = jest.fn().mockResolvedValue([
        { id: 'panelist1', userId: 'user1' },
        { id: 'panelist2', userId: 'user2' },
      ]);

      prismaService.presentationBlock.update = jest.fn().mockResolvedValue({
        ...existingBlock,
        numPresentations: 3,
        panelists: ['user1', 'user2'],
      });

      const result = await service.update('block1', {
        numPresentations: 3,
        panelists: ['user1', 'user2'],
      });

      expect(result).toBeDefined();
      expect(prismaService.panelist.deleteMany).toHaveBeenCalled();
      expect(prismaService.panelist.createMany).toHaveBeenCalled();
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

  describe('swapPresentations', () => {
    it('should successfully swap two presentations', async () => {
      prismaService.presentation.findUnique = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            id: 'presentation1',
            presentationBlockId: 'block1',
            positionWithinBlock: 1,
          }),
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            id: 'presentation2',
            presentationBlockId: 'block1',
            positionWithinBlock: 2,
          }),
        );

      prismaService.$transaction = jest.fn().mockResolvedValue({});

      const result = await service.swapPresentations('block1', {
        presentation1Id: 'presentation1',
        presentation2Id: 'presentation2',
      });

      expect(prismaService.presentation.findUnique).toHaveBeenCalledTimes(2);
      expect(prismaService.$transaction).toHaveBeenCalledWith([
        prismaService.presentation.update({
          where: { id: 'presentation1' },
          data: { positionWithinBlock: 2 },
        }),
        prismaService.presentation.update({
          where: { id: 'presentation2' },
          data: { positionWithinBlock: 1 },
        }),
      ]);
      expect(result).toEqual({ message: 'Apresentações trocadas com sucesso' });
    });

    it('should throw AppException if presentation 1 is not found', async () => {
      prismaService.presentation.findUnique = jest
        .fn()
        .mockResolvedValueOnce(null);

      await expect(
        service.swapPresentations('block1', {
          presentation1Id: 'presentation1',
          presentation2Id: 'presentation2',
        }),
      ).rejects.toThrow(
        new AppException('Apresentação 1 não foi encontrada nesse bloco', 400),
      );

      expect(prismaService.presentation.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should throw AppException if presentation 2 is not found', async () => {
      prismaService.presentation.findUnique = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            id: 'presentation1',
            presentationBlockId: 'block1',
            positionWithinBlock: 1,
          }),
        )
        .mockResolvedValueOnce(null);

      await expect(
        service.swapPresentations('block1', {
          presentation1Id: 'presentation1',
          presentation2Id: 'presentation2',
        }),
      ).rejects.toThrow(
        new AppException('Apresentação 2 não foi encontrada nesse bloco', 400),
      );

      expect(prismaService.presentation.findUnique).toHaveBeenCalledTimes(2);
    });

    it('should throw AppException if transaction fails', async () => {
      prismaService.presentation.findUnique = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            id: 'presentation1',
            presentationBlockId: 'block1',
            positionWithinBlock: 1,
          }),
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            id: 'presentation2',
            presentationBlockId: 'block1',
            positionWithinBlock: 2,
          }),
        );

      prismaService.$transaction = jest
        .fn()
        .mockRejectedValue(new Error('Transaction Error'));

      await expect(
        service.swapPresentations('block1', {
          presentation1Id: 'presentation1',
          presentation2Id: 'presentation2',
        }),
      ).rejects.toThrow(
        new AppException('Erro interno na troca de apresentações', 500),
      );

      expect(prismaService.presentation.findUnique).toHaveBeenCalledTimes(2);
      expect(prismaService.$transaction).toHaveBeenCalled();
    });
  });
});
