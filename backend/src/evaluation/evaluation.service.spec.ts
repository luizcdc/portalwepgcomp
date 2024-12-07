import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationService } from './evaluation.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EvaluationService', () => {
  let evaluationService: EvaluationService;
  let prismaService: PrismaService;

  const mockEvaluations = [
    {
      id: '1',
      userId: 'user1',
      evaluationCriteriaId: 'criteria1',
      submissionId: 'submission1',
      score: 8,
    },
    {
      id: '2',
      userId: 'user1',
      evaluationCriteriaId: 'criteria2',
      submissionId: 'submission1',
      score: 9,
    },
  ];

  const mockExistingEvaluation = {
    id: '1',
    userId: 'user1',
    evaluationCriteriaId: 'criteria1',
    submissionId: 'submission1',
    score: 8,
  };

  const mockPrismaService = {
    evaluation: {
      create: jest.fn(),
      createMany: jest.fn().mockResolvedValue({ count: 1 }),
      update: jest.fn().mockResolvedValue(mockExistingEvaluation),
      findFirst: jest
        .fn()
        .mockResolvedValueOnce(mockExistingEvaluation) // Primeiro registro já existe
        .mockResolvedValueOnce(null), // Segundo registro é novo
      findMany: jest.fn().mockResolvedValue(mockEvaluations),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    evaluationService = module.get<EvaluationService>(EvaluationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(evaluationService).toBeDefined();
  });

  describe('create', () => {
    it('should save multiple evaluations', async () => {
      const dto = [
        {
          userId: 'user1',
          evaluationCriteriaId: 'criteria1',
          submissionId: 'submission1',
          score: 8,
        },
        {
          userId: 'user1',
          evaluationCriteriaId: 'criteria2',
          submissionId: 'submission1',
          score: 9,
        },
      ];

      const result = await evaluationService.create(dto);

      // Verifica que `update` foi chamado para o registro existente
      expect(mockPrismaService.evaluation.update).toHaveBeenCalledWith({
        where: { id: mockExistingEvaluation.id },
        data: {
          score: dto[0].score,
          comments: undefined,
        },
      });

      // Verifica que `createMany` foi chamado para o novo registro
      expect(mockPrismaService.evaluation.createMany).toHaveBeenCalledWith({
        data: [dto[1]], // Somente o novo registro
      });

      // Verifica que o resultado inclui o registro existente atualizado e o novo registro
      expect(result).toEqual([
        { ...mockExistingEvaluation, score: dto[0].score },
        dto[1],
      ]);
    });
  });

  describe('getUserEvaluations', () => {
    it('should return evaluations for a specific user', async () => {
      const userId = 'user1';
      const result = await evaluationService.findOne(userId);
      expect(result).toEqual(mockEvaluations);
      expect(mockPrismaService.evaluation.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: { evaluationCriteria: true, submission: true },
      });
    });
  });

  describe('calculateFinalScore', () => {
    it('should calculate and return the final score for a submission', async () => {
      const submissionId = 'submission1';
      prismaService.evaluation.findMany = jest
        .fn()
        .mockResolvedValue(mockEvaluations);

      const result = await evaluationService.calculateFinalGrade(submissionId);
      expect(result).toEqual(8.5);
      expect(prismaService.evaluation.findMany).toHaveBeenCalledWith({
        where: { submissionId },
        select: { score: true },
      });
    });
  });
});
