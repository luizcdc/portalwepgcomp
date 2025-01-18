import { Test, TestingModule } from '@nestjs/testing';
import { AwardedPanelistsService } from './awarded-panelists.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import { CreateAwardedPanelistsDto } from './dto/create-awarded-panelists.dto';
import { Profile } from '@prisma/client';
import { UserLevel } from '@prisma/client';
import { ResponsePanelistUserDto } from './dto/response-panelist-users.dto';

describe('AwardedPanelistsService', () => {
  let service: AwardedPanelistsService;
  let prismaService: PrismaService;

  const prismaServiceMock = {
    eventEdition: {
      findUnique: jest.fn(),
    },
    panelist: {
      findMany: jest.fn(),
    },
    awardedPanelist: {
      count: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(prismaServiceMock)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwardedPanelistsService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<AwardedPanelistsService>(AwardedPanelistsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('registerAwardedPanelists', () => {
    it('should successfully sync awarded panelists - add new, remove existing, and maintain others', async () => {
      const createAwardedPanelistsDto: CreateAwardedPanelistsDto = {
        eventEditionId: 'event1',
        panelists: [{ userId: 'user1' }, { userId: 'user3' }],
      };

      prismaServiceMock.eventEdition.findUnique.mockResolvedValue({
        id: 'event1',
      });

      const mockCurrentAwardedPanelists = [
        { userId: 'user1', eventEditionId: 'event1' },
        { userId: 'user2', eventEditionId: 'event1' },
      ];

      const mockValidPanelists = [
        { userId: 'user1', presentationBlock: { eventEditionId: 'event1' } },
        { userId: 'user3', presentationBlock: { eventEditionId: 'event1' } },
      ];

      prismaServiceMock.awardedPanelist.findMany.mockResolvedValue(
        mockCurrentAwardedPanelists,
      );

      prismaServiceMock.panelist.findMany.mockResolvedValue(mockValidPanelists);

      const result = await service.registerAwardedPanelists(
        createAwardedPanelistsDto,
      );

      expect(result).toEqual({
        addedPanelists: ['user3'],
        removedPanelists: ['user2'],
        maintainedPanelists: ['user1'],
      });

      expect(prismaServiceMock.awardedPanelist.deleteMany).toHaveBeenCalledWith(
        {
          where: {
            eventEditionId: 'event1',
            userId: { in: ['user2'] },
          },
        },
      );

      expect(prismaServiceMock.awardedPanelist.create).toHaveBeenCalledWith({
        data: {
          eventEditionId: 'event1',
          userId: 'user3',
        },
      });
    });

    it('should throw an error when there are repeated userIds', async () => {
      const dto: CreateAwardedPanelistsDto = {
        eventEditionId: 'event-1',
        panelists: [
          { userId: 'user-1' },
          { userId: 'user-2' },
          { userId: 'user-1' },
        ],
      };

      prismaServiceMock.eventEdition.findUnique.mockResolvedValue({
        id: 'event-1',
      });

      await expect(service.registerAwardedPanelists(dto)).rejects.toThrow(
        new AppException('userIds repetidos na lista de avaliadores.', 400),
      );
    });

    it('should throw an error when event edition does not exist', async () => {
      const dto: CreateAwardedPanelistsDto = {
        eventEditionId: 'non-existent-event',
        panelists: [{ userId: 'user-1' }, { userId: 'user-2' }],
      };

      prismaServiceMock.eventEdition.findUnique.mockResolvedValue(null);

      await expect(service.registerAwardedPanelists(dto)).rejects.toThrow(
        new AppException('Edição do evento não encontrada.', 404),
      );

      expect(prismaServiceMock.eventEdition.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'non-existent-event',
        },
      });
    });

    it('should throw an AppException if the panelists exceed MAX_AWARDED_PANELISTS', async () => {
      const createAwardedPanelistsDto: CreateAwardedPanelistsDto = {
        eventEditionId: 'event1',
        panelists: [
          { userId: 'user1' },
          { userId: 'user2' },
          { userId: 'user3' },
          { userId: 'user4' },
        ],
      };

      prismaServiceMock.eventEdition.findUnique.mockResolvedValue({
        id: 'event1',
      });

      const mockValidPanelists = [
        { userId: 'user1', presentationBlock: { eventEditionId: 'event1' } },
        { userId: 'user2', presentationBlock: { eventEditionId: 'event1' } },
        { userId: 'user3', presentationBlock: { eventEditionId: 'event1' } },
        { userId: 'user4', presentationBlock: { eventEditionId: 'event1' } },
      ];

      prismaServiceMock.panelist.findMany.mockResolvedValue(mockValidPanelists);
      prismaServiceMock.awardedPanelist.findMany.mockResolvedValue([]);

      await expect(
        service.registerAwardedPanelists(createAwardedPanelistsDto),
      ).rejects.toThrow(
        new AppException(
          'Não é permitido haver mais de 3 avaliadores premiados em uma edição.',
          400,
        ),
      );
    });

    it('should throw an AppException if any panelist is not valid', async () => {
      const createAwardedPanelistsDto: CreateAwardedPanelistsDto = {
        eventEditionId: 'event1',
        panelists: [{ userId: 'user1' }, { userId: 'user2' }],
      };

      prismaServiceMock.eventEdition.findUnique.mockResolvedValue({
        id: 'event1',
      });

      const mockValidPanelists = [
        { userId: 'user1', presentationBlock: { eventEditionId: 'event1' } },
      ];

      prismaServiceMock.panelist.findMany.mockResolvedValue(mockValidPanelists);

      await expect(
        service.registerAwardedPanelists(createAwardedPanelistsDto),
      ).rejects.toThrow(
        new AppException('Apenas avaliadores podem ser premiados.', 400),
      );
    });

    it('should handle empty input array by removing all current awarded panelists', async () => {
      const createAwardedPanelistsDto: CreateAwardedPanelistsDto = {
        eventEditionId: 'event1',
        panelists: [],
      };

      prismaServiceMock.eventEdition.findUnique.mockResolvedValue({
        id: 'event1',
      });

      const mockCurrentAwardedPanelists = [
        { userId: 'user1', eventEditionId: 'event1' },
        { userId: 'user2', eventEditionId: 'event1' },
      ];

      prismaServiceMock.awardedPanelist.findMany.mockResolvedValue(
        mockCurrentAwardedPanelists,
      );

      prismaServiceMock.panelist.findMany.mockResolvedValue([]);

      const result = await service.registerAwardedPanelists(
        createAwardedPanelistsDto,
      );

      expect(result).toEqual({
        addedPanelists: [],
        removedPanelists: ['user1', 'user2'],
        maintainedPanelists: [],
      });

      expect(prismaServiceMock.awardedPanelist.deleteMany).toHaveBeenCalledWith(
        {
          where: {
            eventEditionId: 'event1',
            userId: { in: ['user1', 'user2'] },
          },
        },
      );
    });

    it('should handle no changes when input matches current awarded panelists', async () => {
      const createAwardedPanelistsDto: CreateAwardedPanelistsDto = {
        eventEditionId: 'event1',
        panelists: [{ userId: 'user1' }, { userId: 'user2' }],
      };

      prismaServiceMock.eventEdition.findUnique.mockResolvedValue({
        id: 'event1',
      });

      const mockCurrentAwardedPanelists = [
        { userId: 'user1', eventEditionId: 'event1' },
        { userId: 'user2', eventEditionId: 'event1' },
      ];

      const mockValidPanelists = [
        { userId: 'user1', presentationBlock: { eventEditionId: 'event1' } },
        { userId: 'user2', presentationBlock: { eventEditionId: 'event1' } },
      ];

      prismaServiceMock.awardedPanelist.findMany.mockResolvedValue(
        mockCurrentAwardedPanelists,
      );

      prismaServiceMock.panelist.findMany.mockResolvedValue(mockValidPanelists);

      const result = await service.registerAwardedPanelists(
        createAwardedPanelistsDto,
      );

      expect(result).toEqual({
        addedPanelists: [],
        removedPanelists: [],
        maintainedPanelists: ['user1', 'user2'],
      });

      expect(
        prismaServiceMock.awardedPanelist.deleteMany,
      ).not.toHaveBeenCalled();
      expect(prismaServiceMock.awardedPanelist.create).not.toHaveBeenCalled();
    });
  });

  describe('findAllPanelists', () => {
    it('should return all panelists for an event edition', async () => {
      const eventEditionId = 'event1';
      const mockPanelists = [
        {
          user: {
            id: 'user1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            registrationNumber: '12345',
            profile: Profile.Professor,
            level: UserLevel.Default,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            isVerified: true,
          },
        },
      ];
      const expectedResult: ResponsePanelistUserDto[] = [
        new ResponsePanelistUserDto({
          id: 'user1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          registrationNumber: '12345',
          profile: Profile.Professor,
          level: UserLevel.Default,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          isVerified: true,
        }),
      ];

      prismaServiceMock.panelist.findMany.mockResolvedValue(mockPanelists);

      const result = await service.findAllPanelists(eventEditionId);

      expect(result).toEqual(expectedResult);
      expect(prismaServiceMock.panelist.findMany).toHaveBeenCalledWith({
        where: {
          presentationBlock: { eventEditionId },
        },
        include: { user: true },
        distinct: ['userId'],
      });
    });
  });

  describe('findAll', () => {
    it('should return all awarded panelists for an event edition', async () => {
      const eventEditionId = 'event1';
      const mockAwardedPanelists = [
        {
          user: {
            id: 'user1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            registrationNumber: '12345',
            profile: Profile.Professor,
            level: UserLevel.Default,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            isVerified: true,
          },
        },
      ];
      const expectedResult: ResponsePanelistUserDto[] = [
        new ResponsePanelistUserDto({
          id: 'user1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          registrationNumber: '12345',
          profile: Profile.Professor,
          level: UserLevel.Default,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          isVerified: true,
        }),
      ];

      prismaServiceMock.awardedPanelist.findMany.mockResolvedValue(
        mockAwardedPanelists,
      );

      const result = await service.findAll(eventEditionId);

      expect(result).toEqual(expectedResult);
      expect(prismaServiceMock.awardedPanelist.findMany).toHaveBeenCalledWith({
        where: { eventEditionId },
        include: { user: true },
      });
    });
  });

  describe('remove', () => {
    it('should throw an exception if the awarded panelist is not found', async () => {
      const eventEditionId = 'event1';
      const userId = 'user1';

      prismaServiceMock.awardedPanelist.findFirst.mockResolvedValue(null);

      await expect(service.remove(eventEditionId, userId)).rejects.toThrow(
        new AppException('Avaliador premiado não encontrado.', 404),
      );
    });

    it('should remove an awarded panelist by eventEditionId and userId', async () => {
      const eventEditionId = 'event1';
      const userId = 'user1';

      const mockAwardedPanelist = { eventEditionId, userId };

      (prismaService.awardedPanelist.findFirst as jest.Mock).mockResolvedValue(
        mockAwardedPanelist,
      );
      (prismaService.awardedPanelist.delete as jest.Mock).mockResolvedValue(
        undefined,
      );

      await service.remove(eventEditionId, userId);

      expect(prismaService.awardedPanelist.delete).toHaveBeenCalledWith({
        where: {
          eventEditionId_userId: {
            eventEditionId,
            userId,
          },
        },
      });
    });
  });
});
