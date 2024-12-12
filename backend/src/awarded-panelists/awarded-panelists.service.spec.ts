import { Test, TestingModule } from '@nestjs/testing';
import { AwardedPanelistsService } from './awarded-panelists.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import { CreateAwardedPanelistsDto } from './dto/create-awarded-panelists.dto';
import { GetPanelistUsersDto } from './dto/response-panelist-users.dto';
import { Profile } from '@prisma/client';
import { UserLevel } from '@prisma/client';
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
            },
            panelist: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AwardedPanelistsService>(AwardedPanelistsService);
    prismaService = module.get(PrismaService);
  });

  describe('registerAwardedPanelists', () => {
    it('should register awarded panelists if the limit is not exceeded', async () => {
      const mockCount = 2;
      const mockCreateManyResult = { count: 1 };
      const createAwardedPanelistsDto: CreateAwardedPanelistsDto = {
        eventEditionId: 'event1',
        panelists: [{ userId: 'user1' }],
      };

      (prismaService.awardedPanelist.count as jest.Mock).mockResolvedValue(mockCount);
      (prismaService.awardedPanelist.createMany as jest.Mock).mockResolvedValue(mockCreateManyResult);

      const result = await service.registerAwardedPanelists(createAwardedPanelistsDto);

      expect(result).toEqual(mockCreateManyResult);
      expect(prismaService.awardedPanelist.createMany).toHaveBeenCalledWith({
        data: [{ userId: 'user1', eventEditionId: 'event1' }],
      });
    });

    it('should throw an AppException if the limit of 3 is exceeded', async () => {
      const mockCount = 3;
      const createAwardedPanelistsDto: CreateAwardedPanelistsDto = {
        eventEditionId: 'event1',
        panelists: [{ userId: 'user1' }],
      };

      (prismaService.awardedPanelist.count as jest.Mock).mockResolvedValue(mockCount);

      await expect(service.registerAwardedPanelists(createAwardedPanelistsDto)).rejects.toThrow(
        new AppException('Não é permitido haver mais de 3 avaliadores premiados em uma edição.', 400),
      );
    });
  });

  describe('findAllPanelist', () => {
    it('should return all present panelists for an event edition', async () => {
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
      const expectedResult: GetPanelistUsersDto[] = [
        {
          id: 'user1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          registrationNumber: '12345',
          photoFilePath: '/path/to/photo.jpg',
          profile: Profile.Professor,
          level: UserLevel.Default,
        },
      ];

      (prismaService.panelist.findMany as jest.Mock).mockResolvedValue(mockPanelists);

      const result = await service.findAllPanelists(eventEditionId);

      expect(result).toEqual(expectedResult);
      expect(prismaService.panelist.findMany).toHaveBeenCalledWith({
        where: {
          presentationBlock: { eventEditionId },
          status: PanelistStatus.Present,
        },
        include: { user: true },
        distinct: ['userId'],
      });
    });
  });

  describe('findAllByEventEdition', () => {
    it('should return all awarded panelists for an event edition', async () => {
      const eventEditionId = 'event1';
      const mockAwardedPanelists = [
        {
          user: {
            id: 'user1',
            name: 'John Doe',
          },
        },
      ];

      (prismaService.awardedPanelist.findMany as jest.Mock).mockResolvedValue(mockAwardedPanelists);

      const result = await service.findAll(eventEditionId);

      expect(result).toEqual(mockAwardedPanelists);
      expect(prismaService.awardedPanelist.findMany).toHaveBeenCalledWith({
        where: { eventEditionId },
        include: { user: true },
      });
    });
  });

  describe('remove', () => {
    it('should remove an awarded panelist by eventEditionId and userId', async () => {
      const eventEditionId = 'event1';
      const userId = 'user1';

      (prismaService.awardedPanelist.delete as jest.Mock).mockResolvedValue(undefined);

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