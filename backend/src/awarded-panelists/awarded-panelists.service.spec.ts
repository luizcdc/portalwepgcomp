import { Test, TestingModule } from '@nestjs/testing';
import { AwardedPanelistsService } from './awarded-panelists.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import { CreateAwardedPanelistsDto } from './dto/create-awarded-panelists.dto';
import { Profile } from '@prisma/client';
import { UserLevel } from '@prisma/client';
import { ResponsePanelistUserDto } from './dto/response-panelist-users.dto';
import { PanelistStatus } from '@prisma/client';

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
              findFirst: jest.fn(),
              create: jest.fn(),
            },
            panelist: {
              findMany: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AwardedPanelistsService>(AwardedPanelistsService);
    prismaService = module.get(PrismaService);
  });

  describe('registerAwardedPanelists', () => {
    it('should register awarded panelists with existing and new panelists', async () => {
      const createAwardedPanelistsDto: CreateAwardedPanelistsDto = {
        eventEditionId: 'event1',
        panelists: [{ userId: 'user1' }, { userId: 'user2' }],
      };

      const mockExistingAwardedPanelists = [
        { userId: 'user1', eventEditionId: 'event1' },
      ];

      const mockCurrentAwardedPanelists = 1;

      const mockValidPanelists = [
        {
          userId: 'user2',
          presentationBlock: { eventEditionId: 'event1' },
          status: PanelistStatus.Present,
        },
      ];

      const mockCreatedAwardedPanelist = {
        userId: 'user2',
        eventEditionId: 'event1',
      };

      (prismaService.awardedPanelist.findMany as jest.Mock).mockResolvedValue(
        mockExistingAwardedPanelists,
      );

      (prismaService.awardedPanelist.count as jest.Mock).mockResolvedValue(
        mockCurrentAwardedPanelists,
      );

      (prismaService.panelist.findMany as jest.Mock).mockResolvedValue(
        mockValidPanelists,
      );

      (prismaService.awardedPanelist.create as jest.Mock).mockResolvedValue(
        mockCreatedAwardedPanelist,
      );

      (prismaService.$transaction as jest.Mock).mockImplementation(
        (callback) => {
          // If callback is a function, call it and return its result
          if (typeof callback === 'function') {
            return callback(prismaService);
          }
          // If it's an array of promises, resolve them
          return Promise.all(callback);
        },
      );

      const result = await service.registerAwardedPanelists(
        createAwardedPanelistsDto,
      );

      expect(result).toEqual({
        newAwardedPanelists: ['user2'],
        alreadyAwardedPanelists: ['user1'],
      });

      // Additional assertions to verify the method calls
      expect(prismaService.awardedPanelist.create).toHaveBeenCalledWith({
        data: {
          eventEditionId: 'event1',
          userId: 'user2',
        },
      });
    });

    it('should throw an AppException if the limit of 3 is exceeded', async () => {
      const createAwardedPanelistsDto: CreateAwardedPanelistsDto = {
        eventEditionId: 'event1',
        panelists: [{ userId: 'user1' }, { userId: 'user2' }],
      };

      const mockExistingAwardedPanelists = [
        { userId: 'user3', eventEditionId: 'event1' },
      ];

      (prismaService.awardedPanelist.findMany as jest.Mock).mockResolvedValue(
        mockExistingAwardedPanelists,
      );

      (prismaService.awardedPanelist.count as jest.Mock).mockResolvedValue(2);

      await expect(
        service.registerAwardedPanelists(createAwardedPanelistsDto),
      ).rejects.toThrow(
        new AppException(
          'Não é permitido haver mais de 3 avaliadores premiados em uma edição.',
          400,
        ),
      );
    });

    it('should throw an AppException if panelists are not valid', async () => {
      const createAwardedPanelistsDto: CreateAwardedPanelistsDto = {
        eventEditionId: 'event1',
        panelists: [{ userId: 'user1' }],
      };

      const mockExistingAwardedPanelists = [];

      (prismaService.awardedPanelist.findMany as jest.Mock).mockResolvedValue(
        mockExistingAwardedPanelists,
      );

      (prismaService.awardedPanelist.count as jest.Mock).mockResolvedValue(0);

      (prismaService.panelist.findMany as jest.Mock).mockResolvedValue([]);

      await expect(
        service.registerAwardedPanelists(createAwardedPanelistsDto),
      ).rejects.toThrow(
        new AppException('Apenas avaliadores podem ser premiados.', 400),
      );
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
            photoFilePath: '/path/to/photo.jpg',
            profile: Profile.Professor,
            level: UserLevel.Default,
          },
        },
      ];
      const expectedResult: ResponsePanelistUserDto[] = [
        new ResponsePanelistUserDto({
          id: 'user1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          registrationNumber: '12345',
          photoFilePath: '/path/to/photo.jpg',
          profile: Profile.Professor,
          level: UserLevel.Default,
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
            photoFilePath: '/path/to/photo.jpg',
            profile: Profile.Professor,
            level: UserLevel.Default,
          },
        },
      ];
      const expectedResult: ResponsePanelistUserDto[] = [
        new ResponsePanelistUserDto({
          id: 'user1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          registrationNumber: '12345',
          photoFilePath: '/path/to/photo.jpg',
          profile: Profile.Professor,
          level: UserLevel.Default,
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
