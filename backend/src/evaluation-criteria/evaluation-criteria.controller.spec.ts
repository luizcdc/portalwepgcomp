import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationCriteriaController } from './evaluation-criteria.controller';
import { EvaluationCriteriaService } from './evaluation-criteria.service';

describe('EvaluationCriteriaController', () => {
  let controller: EvaluationCriteriaController;
  let service: EvaluationCriteriaService;

  const mockEvaluationCriteriaService = {
    findAll: jest.fn(),
    createFromList: jest.fn(),
    editFromList: jest.fn(),
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

  describe('createFromList', () => {
    beforeEach(() => {
      mockEvaluationCriteriaService.createFromList = jest.fn();
    });

    it('should create multiple evaluation criteria successfully', async () => {
      const mockPayload = [
        {
          eventEditionId: '12345',
          title: 'Methodology',
          description: 'Evaluate the research methodology.',
          weightRadio: 0.4,
        },
        {
          eventEditionId: '12345',
          title: 'Innovation',
          description: 'Evaluate the innovation level.',
          weightRadio: 0.6,
        },
      ];

      const mockResponse = { count: 2 };

      mockEvaluationCriteriaService.createFromList.mockResolvedValue(
        mockResponse,
      );

      const result = await controller.createFromList(mockPayload);

      expect(result).toEqual(mockResponse);
      expect(service.createFromList).toHaveBeenCalledWith(mockPayload);
      expect(service.createFromList).toHaveBeenCalledTimes(1);
    });

    it('should handle empty array of criteria', async () => {
      const emptyPayload = [];
      const mockResponse = { count: 0 };

      mockEvaluationCriteriaService.createFromList.mockResolvedValue(
        mockResponse,
      );

      const result = await controller.createFromList(emptyPayload);

      expect(result).toEqual(mockResponse);
      expect(service.createFromList).toHaveBeenCalledWith(emptyPayload);
      expect(service.createFromList).toHaveBeenCalledTimes(1);
    });
  });

  describe('editFromList', () => {
    beforeEach(() => {
      mockEvaluationCriteriaService.editFromList = jest.fn();
    });

    it('should update multiple evaluation criteria successfully', async () => {
      const mockPayload = [
        {
          id: '1',
          eventEditionId: '12345',
          title: 'Updated Methodology',
          description: 'Updated methodology description',
          weightRadio: 0.5,
        },
        {
          id: '2',
          eventEditionId: '12345',
          title: 'Updated Innovation',
          description: 'Updated innovation description',
          weightRadio: 0.5,
        },
      ];

      const mockResponse = { count: 2 };

      mockEvaluationCriteriaService.editFromList.mockResolvedValue(
        mockResponse,
      );

      const result = await controller.editFromList(mockPayload);

      expect(result).toEqual(mockResponse);
      expect(service.editFromList).toHaveBeenCalledWith(mockPayload);
      expect(service.editFromList).toHaveBeenCalledTimes(1);
    });

    it('should handle empty array of criteria for update', async () => {
      const emptyPayload = [];
      const mockResponse = { count: 0 };

      mockEvaluationCriteriaService.editFromList.mockResolvedValue(
        mockResponse,
      );

      const result = await controller.editFromList(emptyPayload);

      expect(result).toEqual(mockResponse);
      expect(service.editFromList).toHaveBeenCalledWith(emptyPayload);
      expect(service.editFromList).toHaveBeenCalledTimes(1);
    });
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
