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
            },
            userAccount: {
              findMany: jest.fn(),
            },
            panelist: {
              createMany: jest.fn(),
              findMany: jest.fn(),
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
      ).rejects.toThrow(
        new AppException('Edição do evento não encontrada', 404),
      );
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
      ).rejects.toThrow(new AppException('Sala não encontrada', 404));
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
          'O início da sessão foi marcado para antes do início da edição do evento',
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
          'O início da sessão foi marcado para depois do fim da edição do evento',
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
          'O fim da sessão foi marcado para depois do fim da edição do evento',
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
        type: PresentationBlockType.Presentation,
        numPresentations: 3,
      });

      expect(result).toEqual(presentationBlock);
    });
    it('should create a presentation block with panelists', async () => {
      const now = new Date();
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        startDate: new Date(now.getTime() - 2),
        endDate: new Date(now.getTime() + 5 * 60 * 1000),
      });
      prismaService.userAccount.findMany = jest
        .fn()
        .mockResolvedValue([{ id: 'user1' }, { id: 'user2' }]);
      prismaService.panelist.createMany = jest.fn().mockResolvedValue({});

      const presentationBlock = {
        id: '1',
        eventEditionId: '123',
        startTime: now,
        duration: 5,
        type: PresentationBlockType.Presentation,
        presentations: [],
        panelists: [{ id: 'panel1' }, { id: 'panel2' }],
      };
      prismaService.presentationBlock.create = jest
        .fn()
        .mockResolvedValue(presentationBlock);

      const result = await service.create({
        eventEditionId: '123',
        startTime: now,
        type: PresentationBlockType.Presentation,
        numPresentations: 3,
        panelists: ['user1', 'user2'],
      });

      expect(result).toEqual(presentationBlock);
      expect(prismaService.userAccount.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['user1', 'user2'] } },
      });
      expect(prismaService.panelist.createMany).toHaveBeenCalledWith({
        data: [
          { userId: 'user1', presentationBlockId: '1' },
          { userId: 'user2', presentationBlockId: '1' },
        ],
      });
    });

    it('should throw an AppException if a panelist does not exist', async () => {
      const now = new Date();
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        startDate: new Date(now.getTime() - 2),
        endDate: new Date(now.getTime() + 5 * 60 * 1000),
      });
      prismaService.userAccount.findMany = jest
        .fn()
        .mockResolvedValue([{ id: 'user1' }]);

      await expect(
        service.create({
          eventEditionId: '123',
          startTime: now,
          type: PresentationBlockType.Presentation,
          numPresentations: 1,
          panelists: ['user1', 'user2'],
        }),
      ).rejects.toThrow(
        new AppException('Um dos avaliadores informados não existe', 404),
      );
    });

    it('should create a presentation block with presentations', async () => {
      const now = new Date();
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        startDate: new Date(now.getTime() - 2),
        endDate: new Date(now.getTime() + 5 * 60 * 1000),
      });
      prismaService.presentation.findMany = jest
        .fn()
        .mockResolvedValue([{ id: 'pres1' }, { id: 'pres2' }]);
      prismaService.presentation.updateMany = jest.fn().mockResolvedValue({});

      const presentationBlock = {
        id: '1',
        eventEditionId: '123',
        startTime: now,
        duration: 5,
        type: PresentationBlockType.Presentation,
        presentations: [{ id: 'pres1' }, { id: 'pres2' }],
        panelists: [],
      };
      prismaService.presentationBlock.create = jest
        .fn()
        .mockResolvedValue(presentationBlock);

      const result = await service.create({
        eventEditionId: '123',
        startTime: now,
        numPresentations: 2,
        type: PresentationBlockType.Presentation,
        presentations: ['pres1', 'pres2'],
      });

      expect(result).toEqual(presentationBlock);
      expect(prismaService.presentation.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['pres1', 'pres2'] } },
      });
      expect(prismaService.presentation.updateMany).toHaveBeenCalledWith({
        where: { id: { in: ['pres1', 'pres2'] } },
        data: { presentationBlockId: '1' },
      });
    });

    it('should throw an AppException if a presentation does not exist', async () => {
      const now = new Date();
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        startDate: new Date(now.getTime() - 2),
        endDate: new Date(now.getTime() + 5 * 60 * 1000),
      });
      prismaService.presentation.findMany = jest
        .fn()
        .mockResolvedValue([{ id: 'pres1' }]);

      await expect(
        service.create({
          eventEditionId: '123',
          startTime: now,
          type: PresentationBlockType.Presentation,
          numPresentations: 2,
          presentations: ['pres1', 'pres2'],
        }),
      ).rejects.toThrow(
        new AppException('Uma das apresentações informadas não existe', 404),
      );
    });
    it('should throw an AppException if trying to create a General block with only numPresentations', async () => {
      const now = new Date();
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        startDate: new Date(now.getTime() - 2),
        endDate: new Date(now.getTime() + 5 * 60 * 1000),
      });

      await expect(
        service.create({
          eventEditionId: '123',
          startTime: now,
          type: PresentationBlockType.General,
          numPresentations: 2,
        }),
      ).rejects.toThrow(
        new AppException('A duração da sessão geral deve ser informada', 400),
      );
    });
    it('should throw an AppException if trying to create a Presentation block with only duration', async () => {
      const now = new Date();
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue({
        startDate: new Date(now.getTime() - 2),
        endDate: new Date(now.getTime() + 5 * 60 * 1000),
      });

      await expect(
        service.create({
          eventEditionId: '123',
          startTime: now,
          duration: 5,
          type: PresentationBlockType.Presentation,
        }),
      ).rejects.toThrow(
        new AppException(
          'O número de apresentações deve ser informado para sessões de apresentação',
          400,
        ),
      );
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
        'Presentation block not found',
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
        'Event edition not found',
      );
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
