import { Test, TestingModule } from '@nestjs/testing';
import { AwardedPanelistsService } from './awarded-panelists.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import { CreateAwardedPanelistsDto } from './dto/create-awarded-panelists.dto';
import { Profile } from '@prisma/client';
import { UserLevel } from '@prisma/client';
import { ResponsePanelistUserDto } from './dto/response-panelist-users.dto';

jest.mock('../prisma/prisma.service');

describe('AwardedPanelistsService', () => {
  let service: AwardedPanelistsService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwardedPanelistsService,
        {
          provide: PrismaService,
          useValue: {
            awardedPanelist: {
              count: jest.fn(),
              createMany: jest.fn(),
              findMany: jest.fn(),
              delete: jest.fn(),
              deleteMany: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
            },
            panelist: {
              findMany: jest.fn(),
            },
            $transaction: jest
              .fn()
              .mockImplementation((callback) => callback(prismaService)),
          },
        },
      ],
    }).compile();

    service = module.get<AwardedPanelistsService>(AwardedPanelistsService);
    prismaService = module.get(PrismaService);
  });

  describe('registerAwardedPanelists', () => {
    it('should successfully sync awarded panelists - add new, remove existing, and maintain others', async () => {
      // Setup test data
      const createAwardedPanelistsDto: CreateAwardedPanelistsDto = {
        eventEditionId: 'event1',
        panelists: [
          { userId: 'user1' }, // maintain
          { userId: 'user3' }, // add new
        ],
      };

      // Mock current awarded panelists (user1 and user2)
      const mockCurrentAwardedPanelists = [
        { userId: 'user1', eventEditionId: 'event1' }, // will maintain
        { userId: 'user2', eventEditionId: 'event1' }, // will remove
      ];

      // Mock valid panelists check
      const mockValidPanelists = [
        { userId: 'user1', presentationBlock: { eventEditionId: 'event1' } },
        { userId: 'user3', presentationBlock: { eventEditionId: 'event1' } },
      ];

      // Setup mocks
      (prismaService.awardedPanelist.findMany as jest.Mock).mockResolvedValue(
        mockCurrentAwardedPanelists,
      );

      (prismaService.panelist.findMany as jest.Mock).mockResolvedValue(
        mockValidPanelists,
      );

      (prismaService.$transaction as jest.Mock).mockImplementation(
        (callback) => {
          if (typeof callback === 'function') {
            return callback(prismaService);
          }
          return Promise.all(callback);
        },
      );

      const result = await service.registerAwardedPanelists(
        createAwardedPanelistsDto,
      );

      expect(result).toEqual({
        addedPanelists: ['user3'],
        removedPanelists: ['user2'],
        maintainedPanelists: ['user1'],
      });

      // Verify the deleteMany was called correctly
      expect(prismaService.awardedPanelist.deleteMany).toHaveBeenCalledWith({
        where: {
          eventEditionId: 'event1',
          userId: { in: ['user2'] },
        },
      });

      // Verify the create was called correctly
      expect(prismaService.awardedPanelist.create).toHaveBeenCalledWith({
        data: {
          eventEditionId: 'event1',
          userId: 'user3',
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
          { userId: 'user4' }, // Exceeds limit of 3
        ],
      };

      const mockValidPanelists = [
        { userId: 'user1', presentationBlock: { eventEditionId: 'event1' } },
        { userId: 'user2', presentationBlock: { eventEditionId: 'event1' } },
        { userId: 'user3', presentationBlock: { eventEditionId: 'event1' } },
        { userId: 'user4', presentationBlock: { eventEditionId: 'event1' } },
      ];

      (prismaService.panelist.findMany as jest.Mock).mockResolvedValue(
        mockValidPanelists,
      );

      (prismaService.awardedPanelist.findMany as jest.Mock).mockResolvedValue(
        [],
      );

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
        panelists: [
          { userId: 'user1' },
          { userId: 'user2' }, // This one won't be in valid panelists
        ],
      };

      // Mock valid panelists check - only user1 is valid
      const mockValidPanelists = [
        { userId: 'user1', presentationBlock: { eventEditionId: 'event1' } },
      ];

      (prismaService.panelist.findMany as jest.Mock).mockResolvedValue(
        mockValidPanelists,
      );

      await expect(
        service.registerAwardedPanelists(createAwardedPanelistsDto),
      ).rejects.toThrow(
        new AppException('Apenas avaliadores podem ser premiados.', 400),
      );
    });

    it('should handle empty input array by removing all current awarded panelists', async () => {
      const createAwardedPanelistsDto: CreateAwardedPanelistsDto = {
        eventEditionId: 'event1',
        panelists: [], // Empty array
      };

      // Mock current awarded panelists
      const mockCurrentAwardedPanelists = [
        { userId: 'user1', eventEditionId: 'event1' },
        { userId: 'user2', eventEditionId: 'event1' },
      ];

      (prismaService.awardedPanelist.findMany as jest.Mock).mockResolvedValue(
        mockCurrentAwardedPanelists,
      );

      (prismaService.panelist.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.registerAwardedPanelists(
        createAwardedPanelistsDto,
      );

      expect(result).toEqual({
        addedPanelists: [],
        removedPanelists: ['user1', 'user2'],
        maintainedPanelists: [],
      });

      expect(prismaService.awardedPanelist.deleteMany).toHaveBeenCalledWith({
        where: {
          eventEditionId: 'event1',
          userId: { in: ['user1', 'user2'] },
        },
      });
    });

    it('should handle no changes when input matches current awarded panelists', async () => {
      const createAwardedPanelistsDto: CreateAwardedPanelistsDto = {
        eventEditionId: 'event1',
        panelists: [{ userId: 'user1' }, { userId: 'user2' }],
      };

      const mockCurrentAwardedPanelists = [
        { userId: 'user1', eventEditionId: 'event1' },
        { userId: 'user2', eventEditionId: 'event1' },
      ];

      const mockValidPanelists = [
        { userId: 'user1', presentationBlock: { eventEditionId: 'event1' } },
        { userId: 'user2', presentationBlock: { eventEditionId: 'event1' } },
      ];

      (prismaService.awardedPanelist.findMany as jest.Mock).mockResolvedValue(
        mockCurrentAwardedPanelists,
      );

      (prismaService.panelist.findMany as jest.Mock).mockResolvedValue(
        mockValidPanelists,
      );

      const result = await service.registerAwardedPanelists(
        createAwardedPanelistsDto,
      );

      expect(result).toEqual({
        addedPanelists: [],
        removedPanelists: [],
        maintainedPanelists: ['user1', 'user2'],
      });

      expect(prismaService.awardedPanelist.deleteMany).not.toHaveBeenCalled();
      expect(prismaService.awardedPanelist.create).not.toHaveBeenCalled();
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

      (prismaService.panelist.findMany as jest.Mock).mockResolvedValue(
        mockPanelists,
      );

      const result = await service.findAllPanelists(eventEditionId);

      expect(result).toEqual(expectedResult);
      expect(prismaService.panelist.findMany).toHaveBeenCalledWith({
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

      (prismaService.awardedPanelist.findMany as jest.Mock).mockResolvedValue(
        mockAwardedPanelists,
      );

      const result = await service.findAll(eventEditionId);

      expect(result).toEqual(expectedResult);
      expect(prismaService.awardedPanelist.findMany).toHaveBeenCalledWith({
        where: { eventEditionId },
        include: { user: true },
      });
    });
  });

  describe('remove', () => {
    it('should throw an exception if the awarded panelist is not found', async () => {
      const eventEditionId = 'event1';
      const userId = 'user1';

      (prismaService.awardedPanelist.findFirst as jest.Mock).mockResolvedValue(
        null,
      );

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
