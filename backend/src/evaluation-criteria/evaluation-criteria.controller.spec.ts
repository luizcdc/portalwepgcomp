import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationCriteriaController } from './evaluation-criteria.controller';
import { EvaluationCriteriaService } from './evaluation-criteria.service';

describe('EvaluationCriteriaController', () => {
  let controller: EvaluationCriteriaController;
  let service: EvaluationCriteriaService;

  const mockEvaluationCriteriaService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluationCriteriaController],
      providers: [
        {
          provide: EvaluationCriteriaService,
          useValue: mockEvaluationCriteriaService,
        },
      ],
    }).compile();

    controller = module.get<EvaluationCriteriaController>(
      EvaluationCriteriaController,
    );
    service = module.get<EvaluationCriteriaService>(EvaluationCriteriaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of evaluation criteria', async () => {
      const eventEditionId = '12345';
      const mockCriteria = [
        {
          id: '1',
          eventEditionId,
          title: 'Originality',
          description: 'Evaluate the originality of the research.',
          weightRadio: 0.3,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          updatedAt: new Date('2024-01-01T00:00:00.000Z'),
          evaluations: [],
        },
        {
          id: '2',
          eventEditionId,
          title: 'Clarity',
          description: 'Evaluate the clarity of the research.',
          weightRadio: 0.5,
          createdAt: new Date('2024-01-02T00:00:00.000Z'),
          updatedAt: new Date('2024-01-02T00:00:00.000Z'),
          evaluations: [],
        },
      ];

      mockEvaluationCriteriaService.findAll.mockResolvedValue(mockCriteria);

      const result = await controller.findAll(eventEditionId);

      expect(result).toEqual(mockCriteria);
      expect(service.findAll).toHaveBeenCalledWith(eventEditionId);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
