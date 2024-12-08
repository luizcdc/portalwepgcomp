import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';

describe('EvaluationController', () => {
  let evaluationController: EvaluationController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let evaluationService: EvaluationService;

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

  const mockEvaluationService = {
    create: jest.fn().mockResolvedValue(mockEvaluations),
    findOne: jest.fn().mockResolvedValue(mockEvaluations),
    findAll: jest.fn().mockResolvedValue(mockEvaluations),
    getUserEvaluations: jest.fn().mockResolvedValue(mockEvaluations),
    getAllEvaluations: jest.fn().mockResolvedValue(mockEvaluations),
    calculateFinalGrade: jest.fn().mockResolvedValue(8.5),
    // calculateFinalScore: jest.fn().mockResolvedValue(8.5),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluationController],
      providers: [
        {
          provide: EvaluationService,
          useValue: mockEvaluationService,
        },
      ],
    }).compile();

    evaluationController =
      module.get<EvaluationController>(EvaluationController);
    evaluationService = module.get<EvaluationService>(EvaluationService);
  });

  it('should be defined', () => {
    expect(evaluationController).toBeDefined();
  });

  describe('create', () => {
    it('should create evaluations and return them', async () => {
      const dto: CreateEvaluationDto[] = [
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
      const result = await evaluationController.create(dto);
      expect(result).toEqual(mockEvaluations);
      expect(mockEvaluationService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('find', () => {
    it('should return evaluations for a specific user', async () => {
      const userId = 'user1';
      const result = await evaluationController.find(userId);
      expect(result).toEqual(mockEvaluations);
      expect(mockEvaluationService.findOne).toHaveBeenCalledWith(userId);
    });

    it('should return all evaluations when no userId is provided', async () => {
      const result = await evaluationController.find();
      expect(result).toEqual(mockEvaluations);
      expect(mockEvaluationService.findAll).toHaveBeenCalledWith();
    });
  });

  describe('calculateFinalScore', () => {
    it('should calculate and return the final score for a submission', async () => {
      const submissionId = 'submission1';
      const result =
        await evaluationController.calculateFinalGrade(submissionId);
      expect(result).toEqual(8.5);
      expect(mockEvaluationService.calculateFinalGrade).toHaveBeenCalledWith(
        submissionId,
      );
    });
  });
});
