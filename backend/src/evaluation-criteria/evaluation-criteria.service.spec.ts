import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationCriteriaService } from './evaluation-criteria.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EvaluationCriteriaService', () => {
  let service: EvaluationCriteriaService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    evaluationCriteria: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      createMany: jest.fn(),
      update: jest.fn(),
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

    mockPrismaService.evaluationCriteria.findFirst = jest.fn();
    mockPrismaService.evaluationCriteria.createMany = jest.fn();
    mockPrismaService.evaluationCriteria.update = jest.fn();
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

  describe('createFromList', () => {
    it('should create new evaluation criteria successfully', async () => {
      const criteriaList = [
        {
          title: 'Criteria 1',
          description: 'Description 1',
          weightRadio: 0.5,
          eventEditionId: '12345',
        },
        {
          title: 'Criteria 2',
          description: 'Description 2',
          weightRadio: 1.0,
          eventEditionId: '12345',
        },
      ];

      mockPrismaService.evaluationCriteria.findFirst.mockResolvedValue(null);
      mockPrismaService.evaluationCriteria.createMany.mockResolvedValue({
        count: 2,
      });

      const result = await service.createFromList(criteriaList);

      expect(result).toEqual({ count: 2 });
      expect(
        mockPrismaService.evaluationCriteria.findFirst,
      ).toHaveBeenCalledTimes(2);
      expect(
        mockPrismaService.evaluationCriteria.createMany,
      ).toHaveBeenCalledWith({
        data: criteriaList,
      });
    });

    it('should throw error when duplicate titles exist in input', async () => {
      const criteriaList = [
        {
          title: 'Same Title',
          description: 'Description 1',
          eventEditionId: '12345',
        },
        {
          title: 'Same Title',
          description: 'Description 2',
          eventEditionId: '12345',
        },
      ];

      mockPrismaService.evaluationCriteria.findFirst.mockResolvedValue(null);

      await expect(service.createFromList(criteriaList)).rejects.toThrow(
        'Não é possível criar dois critérios de avaliação com o mesmo título ou descrição para o mesmo evento',
      );
    });

    it('should throw error when duplicate descriptions exist in input', async () => {
      const criteriaList = [
        {
          title: 'Title 1',
          description: 'Same Description',
          eventEditionId: '12345',
        },
        {
          title: 'Title 2',
          description: 'Same Description',
          eventEditionId: '12345',
        },
      ];

      mockPrismaService.evaluationCriteria.findFirst.mockResolvedValue(null);

      await expect(service.createFromList(criteriaList)).rejects.toThrow(
        'Não é possível criar dois critérios de avaliação com o mesmo título ou descrição para o mesmo evento',
      );
    });

    it('should skip existing criteria', async () => {
      const criteriaList = [
        {
          title: 'Existing',
          description: 'Existing Description',
          eventEditionId: '12345',
        },
        {
          title: 'New',
          description: 'New Description',
          eventEditionId: '12345',
        },
      ];

      mockPrismaService.evaluationCriteria.findFirst
        .mockResolvedValueOnce({ id: '1', ...criteriaList[0] })
        .mockResolvedValueOnce(null);

      mockPrismaService.evaluationCriteria.createMany.mockResolvedValue({
        count: 1,
      });

      const result = await service.createFromList(criteriaList);

      expect(result).toEqual({ count: 1 });
      expect(
        mockPrismaService.evaluationCriteria.createMany,
      ).toHaveBeenCalledWith({
        data: [criteriaList[1]],
      });
    });
  });

  describe('editFromList', () => {
    it('should update multiple evaluation criteria successfully', async () => {
      const criteriaList = [
        {
          id: '1',
          title: 'Updated Title 1',
          description: 'Updated Description 1',
          weightRadio: 0.7,
          eventEditionId: '12345',
        },
        {
          id: '2',
          title: 'Updated Title 2',
          description: 'Updated Description 2',
          weightRadio: 0.3,
          eventEditionId: '12345',
        },
      ];

      mockPrismaService.evaluationCriteria.update.mockResolvedValue({});

      await service.editFromList(criteriaList);

      expect(mockPrismaService.evaluationCriteria.update).toHaveBeenCalledTimes(
        2,
      );
      expect(
        mockPrismaService.evaluationCriteria.update,
      ).toHaveBeenNthCalledWith(1, {
        where: { id: '1' },
        data: criteriaList[0],
      });
      expect(
        mockPrismaService.evaluationCriteria.update,
      ).toHaveBeenNthCalledWith(2, {
        where: { id: '2' },
        data: criteriaList[1],
      });
    });

    it('should handle empty list of criteria', async () => {
      const criteriaList = [];

      await service.editFromList(criteriaList);

      expect(
        mockPrismaService.evaluationCriteria.update,
      ).not.toHaveBeenCalled();
    });
  });
});
