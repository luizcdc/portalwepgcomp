import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationCriteriaService } from './evaluation-criteria.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EvaluationCriteriaService', () => {
  let service: EvaluationCriteriaService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    evaluationCriteria: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluationCriteriaService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<EvaluationCriteriaService>(EvaluationCriteriaService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Resetar mocks para evitar interferências entre testes
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of evaluation criteria', async () => {
      const eventEditionId = '12345';
      const mockCriteria = [
        {
          id: '1',
          eventEditionId,
          title: 'Criteria 1',
          description: 'Description 1',
          weightRadio: 0.5,
          createdAt: new Date(),
          updatedAt: new Date(),
          evaluations: [],
        },
        {
          id: '2',
          eventEditionId,
          title: 'Criteria 2',
          description: 'Description 2',
          weightRadio: 1.0,
          createdAt: new Date(),
          updatedAt: new Date(),
          evaluations: [],
        },
      ];

      mockPrismaService.evaluationCriteria.findMany.mockResolvedValue(
        mockCriteria,
      );

      const result = await service.findAll(eventEditionId);

      expect(result).toEqual(mockCriteria);
      expect(prismaService.evaluationCriteria.findMany).toHaveBeenCalledWith({
        where: { eventEditionId },
      });
      expect(prismaService.evaluationCriteria.findMany).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should return an empty array if no criteria are found', async () => {
      const eventEditionId = '12345';
      mockPrismaService.evaluationCriteria.findMany.mockResolvedValue([]);

      const result = await service.findAll(eventEditionId);

      expect(result).toEqual([]);
      expect(prismaService.evaluationCriteria.findMany).toHaveBeenCalledWith({
        where: { eventEditionId },
      });
      expect(prismaService.evaluationCriteria.findMany).toHaveBeenCalledTimes(
        1,
      );
    });
  });
});
