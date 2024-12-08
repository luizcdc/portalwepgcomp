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
        .mockResolvedValueOnce(mockExistingEvaluation) // First register already exists
        .mockResolvedValueOnce(null), // Second register is new
      findMany: jest.fn().mockResolvedValue(mockEvaluations),
    },
    submission: {
      findUnique: jest.fn().mockResolvedValue({ id: 'submission1' }), // Mock for presentations
    },
    userAccount: {
      findUnique: jest.fn().mockResolvedValue({ id: 'user1' }), // Mock for users
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

      expect(mockPrismaService.submission.findUnique).toHaveBeenCalledWith({
        where: { id: 'submission1' },
      });
      expect(mockPrismaService.userAccount.findUnique).toHaveBeenCalledWith({
        where: { id: 'user1' },
      });

      // Verify if `update` was called for existing register
      expect(mockPrismaService.evaluation.update).toHaveBeenCalledWith({
        where: { id: mockExistingEvaluation.id },
        data: {
          score: dto[0].score,
          comments: undefined,
        },
      });

      // Verify if `createMany` was called for new register
      expect(mockPrismaService.evaluation.createMany).toHaveBeenCalledWith({
        data: [dto[1]], // Only new register
      });

      // Verify if result includes the existing register and a new register
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
