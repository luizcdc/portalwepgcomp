import { Test, TestingModule } from '@nestjs/testing';
import { AwardedDoctoralStudentsService } from './awarded-doctoral-students.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  PresentationStatus,
  Profile,
  UserLevel,
  SubmissionStatus,
} from '@prisma/client';

jest.mock('../prisma/prisma.service');

describe('AwardedDoctoralStudentsService', () => {
  let service: AwardedDoctoralStudentsService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUser = {
    id: 'user1',
    name: 'Author 1',
    email: 'author1@example.com',
    registrationNumber: '12345',
    photoFilePath: null,
    profile: Profile.DoctoralStudent,
    level: UserLevel.Default,
    isActive: true,
    isVerified: true,
  };

  const createMockPresentation = (id: string, score: number) => ({
    id,
    presentationBlockId: 'block1',
    positionWithinBlock: 1,
    status: PresentationStatus.Presented,
    publicAverageScore: score,
    evaluatorsAverageScore: score,
    submission: {
      id: `sub${id}`,
      title: 'Test Submission',
      abstract: 'Test Abstract',
      pdfFile: 'test.pdf',
      phoneNumber: '1234567890',
      status: SubmissionStatus.Confirmed,
      mainAuthor: mockUser,
    },
    presentationBlock: {
      id: 'block1',
      eventEditionId: 'event1',
    },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwardedDoctoralStudentsService,
        {
          provide: PrismaService,
          useValue: {
            presentation: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AwardedDoctoralStudentsService>(
      AwardedDoctoralStudentsService,
    );
    prismaService = module.get(PrismaService);
  });

  describe('findTopEvaluatorsRanking', () => {
    it('should return the top 3 presentations sorted by evaluatorsAverageScore', async () => {
      const eventEditionId = 'event1';
      const mockPresentations = [
        createMockPresentation('pres1', 10),
        createMockPresentation('pres2', 8),
        createMockPresentation('pres3', 6),
      ];

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        mockPresentations,
      );

      const result = await service.findTopEvaluatorsRanking(eventEditionId);

      expect(result).toHaveLength(3);
      expect(result[0].evaluatorsAverageScore).toBe('10.00');
      expect(result[1].evaluatorsAverageScore).toBe('8.00');
      expect(result[2].evaluatorsAverageScore).toBe('6.00');
      expect(prismaService.presentation.findMany).toHaveBeenCalledWith({
        where: {
          presentationBlock: {
            eventEditionId,
          },
          evaluatorsAverageScore: {
            not: null,
          },
        },
        orderBy: {
          evaluatorsAverageScore: 'desc',
        },
        take: 3,
        include: {
          submission: {
            include: {
              mainAuthor: true,
            },
          },
        },
      });
    });

    it('should respect the custom limit parameter', async () => {
      const eventEditionId = 'event1';
      const limit = 2;
      const mockPresentations = [
        createMockPresentation('pres1', 10),
        createMockPresentation('pres2', 8),
      ];

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        mockPresentations,
      );

      const result = await service.findTopEvaluatorsRanking(
        eventEditionId,
        limit,
      );

      expect(result).toHaveLength(2);
      expect(prismaService.presentation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: limit,
        }),
      );
    });

    it('should return an empty array if no presentations exist with rankings', async () => {
      const eventEditionId = 'event1';
      const mockPresentations: any[] = [];

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        mockPresentations,
      );

      const result = await service.findTopEvaluatorsRanking(eventEditionId);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findTopPublicRanking', () => {
    it('should return the top 3 presentations sorted by publicAverageScore', async () => {
      const eventEditionId = 'event1';
      const mockPresentations = [
        createMockPresentation('pres1', 9),
        createMockPresentation('pres2', 7),
        createMockPresentation('pres3', 5),
      ];

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        mockPresentations,
      );

      const result = await service.findTopPublicRanking(eventEditionId);

      expect(result).toHaveLength(3);
      expect(result[0].publicAverageScore).toBe('9.00');
      expect(result[1].publicAverageScore).toBe('7.00');
      expect(result[2].publicAverageScore).toBe('5.00');
      expect(prismaService.presentation.findMany).toHaveBeenCalledWith({
        where: {
          presentationBlock: {
            eventEditionId,
          },
          publicAverageScore: {
            not: null,
          },
        },
        orderBy: {
          publicAverageScore: 'desc',
        },
        take: 3,
        include: {
          submission: {
            include: {
              mainAuthor: true,
            },
          },
        },
      });
    });

    it('should respect the custom limit parameter', async () => {
      const eventEditionId = 'event1';
      const limit = 1;
      const mockPresentations = [createMockPresentation('pres1', 9)];

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        mockPresentations,
      );

      const result = await service.findTopPublicRanking(eventEditionId, limit);

      expect(result).toHaveLength(1);
      expect(prismaService.presentation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: limit,
        }),
      );
    });

    it('should return an empty array if no presentations exist with rankings', async () => {
      const eventEditionId = 'event1';
      const mockPresentations: any[] = [];

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        mockPresentations,
      );

      const result = await service.findTopPublicRanking(eventEditionId);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
