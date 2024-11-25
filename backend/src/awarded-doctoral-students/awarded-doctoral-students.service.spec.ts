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
            submission: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AwardedDoctoralStudentsService>(AwardedDoctoralStudentsService);
    prismaService = module.get(PrismaService);
  });

  describe('findTopPanelistsRanking', () => {
    it('should return the top 3 submissions sorted by PanelistRanking', async () => {
      const eventEditionId = 'event1';
      const mockSubmissions = [
        { id: 'sub1', PanelistRanking: 10, mainAuthor: { name: 'Author 1' } },
        { id: 'sub2', PanelistRanking: 8, mainAuthor: { name: 'Author 2' } },
        { id: 'sub3', PanelistRanking: 6, mainAuthor: { name: 'Author 3' } },
      ];

      (prismaService.submission.findMany as jest.Mock).mockResolvedValue(mockSubmissions);

      const result = await service.findTopPanelistsRanking(eventEditionId);

      expect(result).toEqual(mockSubmissions);
      expect(result).toHaveLength(3);
      expect(prismaService.submission.findMany).toHaveBeenCalledWith({
        where: {
          eventEditionId,
          PanelistRanking: {
            not: null,
          },
        },
        orderBy: {
          PanelistRanking: 'desc',
        },
        take: 3,
        include: {
          mainAuthor: true,
        },
      });
    });

    it('should return all available submissions if fewer than 3 exist', async () => {
      const eventEditionId = 'event1';
      const mockSubmissions = [
        { id: 'sub1', PanelistRanking: 10, mainAuthor: { name: 'Author 1' } },
        { id: 'sub2', PanelistRanking: 8, mainAuthor: { name: 'Author 2' } },
      ];

      (prismaService.submission.findMany as jest.Mock).mockResolvedValue(mockSubmissions);

      const result = await service.findTopPanelistsRanking(eventEditionId);

      expect(result).toEqual(mockSubmissions);
      expect(result).toHaveLength(2);
    });

    it('should return an empty array if no submissions exist with rankings', async () => {
      const eventEditionId = 'event1';
      const mockSubmissions: any[] = [];

      (prismaService.submission.findMany as jest.Mock).mockResolvedValue(mockSubmissions);

      const result = await service.findTopPanelistsRanking(eventEditionId);

      expect(result).toEqual(mockSubmissions);
      expect(result).toHaveLength(0);
    });
  });

  describe('findTopAudienceRanking', () => {
    it('should return the top 3 submissions sorted by AudienceRanking', async () => {
      const eventEditionId = 'event1';
      const mockSubmissions = [
        { id: 'sub1', AudienceRanking: 9, mainAuthor: { name: 'Author 1' } },
        { id: 'sub2', AudienceRanking: 7, mainAuthor: { name: 'Author 2' } },
        { id: 'sub3', AudienceRanking: 5, mainAuthor: { name: 'Author 3' } },
      ];

      (prismaService.submission.findMany as jest.Mock).mockResolvedValue(mockSubmissions);

      const result = await service.findTopAudienceRanking(eventEditionId);

      expect(result).toEqual(mockSubmissions);
      expect(result).toHaveLength(3);
      expect(prismaService.submission.findMany).toHaveBeenCalledWith({
        where: {
          eventEditionId,
          AudienceRanking: {
            not: null,
          },
        },
        orderBy: {
          AudienceRanking: 'desc',
        },
        take: 3,
        include: {
          mainAuthor: true,
        },
      });
    });

    it('should return all available submissions if fewer than 3 exist', async () => {
      const eventEditionId = 'event1';
      const mockSubmissions = [
        { id: 'sub1', AudienceRanking: 9, mainAuthor: { name: 'Author 1' } },
      ];

      (prismaService.submission.findMany as jest.Mock).mockResolvedValue(mockSubmissions);

      const result = await service.findTopAudienceRanking(eventEditionId);

      expect(result).toEqual(mockSubmissions);
      expect(result).toHaveLength(1);
    });

    it('should return an empty array if no submissions exist with rankings', async () => {
      const eventEditionId = 'event1';
      const mockSubmissions: any[] = [];

      (prismaService.submission.findMany as jest.Mock).mockResolvedValue(mockSubmissions);

      const result = await service.findTopAudienceRanking(eventEditionId);

      expect(result).toEqual(mockSubmissions);
      expect(result).toHaveLength(0);
    });
  });
});
