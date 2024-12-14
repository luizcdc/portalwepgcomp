import { Test, TestingModule } from '@nestjs/testing';
import { AwardedDoctoralStudentsService } from './awarded-doctoral-students.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('../prisma/prisma.service');

describe('AwardedDoctoralStudentsService', () => {
  let service: AwardedDoctoralStudentsService;
  let prismaService: jest.Mocked<PrismaService>;

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
        {
          id: 'pres1',
          evaluatorsAverageScore: 10,
          submission: { mainAuthor: { name: 'Author 1' } },
          presentationBlock: { eventEditionId: 'event1' },
        },
        {
          id: 'pres2',
          evaluatorsAverageScore: 8,
          submission: { mainAuthor: { name: 'Author 2' } },
          presentationBlock: { eventEditionId: 'event1' },
        },
        {
          id: 'pres3',
          evaluatorsAverageScore: 6,
          submission: { mainAuthor: { name: 'Author 3' } },
          presentationBlock: { eventEditionId: 'event1' },
        },
      ];

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        mockPresentations,
      );

      const result = await service.findTopEvaluatorsRanking(eventEditionId);

      expect(result).toHaveLength(3);
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

    it('should return all available presentations if fewer than 3 exist', async () => {
      const eventEditionId = 'event1';
      const mockPresentations = [
        {
          id: 'pres1',
          evaluatorsAverageScore: 10,
          submission: { mainAuthor: { name: 'Author 1' } },
          presentationBlock: { eventEditionId: 'event1' },
        },
        {
          id: 'pres2',
          evaluatorsAverageScore: 8,
          submission: { mainAuthor: { name: 'Author 2' } },
          presentationBlock: { eventEditionId: 'event1' },
        },
      ];

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        mockPresentations,
      );

      const result = await service.findTopEvaluatorsRanking(eventEditionId);

      expect(result).toHaveLength(2);
    });

    it('should return an empty array if no presentations exist with rankings', async () => {
      const eventEditionId = 'event1';
      const mockPresentations: any[] = [];

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        mockPresentations,
      );

      const result = await service.findTopEvaluatorsRanking(eventEditionId);

      expect(result).toEqual(mockPresentations);
      expect(result).toHaveLength(0);
    });
  });

  describe('findTopPublicRanking', () => {
    it('should return the top 3 presentations sorted by publicAverageScore', async () => {
      const eventEditionId = 'event1';
      const mockPresentations = [
        {
          id: 'pres1',
          publicAverageScore: 9,
          submission: { mainAuthor: { name: 'Author 1' } },
          presentationBlock: { eventEditionId: 'event1' },
        },
        {
          id: 'pres2',
          publicAverageScore: 7,
          submission: { mainAuthor: { name: 'Author 2' } },
          presentationBlock: { eventEditionId: 'event1' },
        },
        {
          id: 'pres3',
          publicAverageScore: 5,
          submission: { mainAuthor: { name: 'Author 3' } },
          presentationBlock: { eventEditionId: 'event1' },
        },
      ];

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        mockPresentations,
      );

      const result = await service.findTopPublicRanking(eventEditionId);

      expect(result).toHaveLength(3);
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

    it('should return all available presentations if fewer than 3 exist', async () => {
      const eventEditionId = 'event1';
      const mockPresentations = [
        {
          id: 'pres1',
          publicAverageScore: 9,
          submission: { mainAuthor: { name: 'Author 1' } },
          presentationBlock: { eventEditionId: 'event1' },
        },
      ];

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        mockPresentations,
      );

      const result = await service.findTopPublicRanking(eventEditionId);

      expect(result).toHaveLength(1);
    });

    it('should return an empty array if no presentations exist with rankings', async () => {
      const eventEditionId = 'event1';
      const mockPresentations: any[] = [];

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        mockPresentations,
      );

      const result = await service.findTopPublicRanking(eventEditionId);

      expect(result).toEqual(mockPresentations);
      expect(result).toHaveLength(0);
    });
  });
});
