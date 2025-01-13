import { Test, TestingModule } from '@nestjs/testing';
import { PresentationController } from './presentation.controller';
import { PresentationService } from './presentation.service';
import { ListAdvisedPresentationsResponse } from './dto/list-advised-presentations.dto';
import { AppException } from '../exceptions/app.exception';

describe('PresentationController', () => {
  let controller: PresentationController;
  let service: PresentationService;

  const mockPresentationService = {
    create: jest.fn().mockResolvedValue({}),
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue([]),
    update: jest.fn().mockResolvedValue([]),
    remove: jest.fn().mockResolvedValue([]),
    listAdvisedPresentations: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresentationController],
      providers: [
        {
          provide: PresentationService,
          useValue: mockPresentationService,
        },
      ],
    }).compile();

    controller = module.get<PresentationController>(PresentationController);
    service = module.get<PresentationService>(PresentationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listAdvisedPresentations', () => {
    it('should return an array of advised presentations', async () => {
      const mockUserId = '123';
      const mockRequest = { user: { userId: mockUserId } };
      const mockResponse: Array<ListAdvisedPresentationsResponse> = [
        {
          id: '8c89b11f-aaa8-4ee6-8b07-3300878a2a18',
          submissionId: 'ebd08e6a-78e3-46c2-8acb-0b2f399f886a',
          presentationBlockId: '113df297-cdb8-422f-88b3-b09d30121dba',
          positionWithinBlock: 0,
          status: 'ToPresent',
          createdAt: new Date('2024-12-27T15:50:13.125Z'),
          updatedAt: new Date('2024-12-27T15:50:13.125Z'),
          publicAverageScore: null,
          evaluatorsAverageScore: null,
        },
        {
          id: 'c4074556-f78b-4f34-baa3-cabebcdd9d01',
          submissionId: '5de8e22b-abac-4fcf-87d1-5d45f9e006da',
          presentationBlockId: 'c16135ea-3004-4500-8a39-be5ccd76108d',
          positionWithinBlock: 0,
          status: 'ToPresent',
          createdAt: new Date('2024-12-27T15:50:13.129Z'),
          updatedAt: new Date('2024-12-27T15:50:13.129Z'),
          publicAverageScore: null,
          evaluatorsAverageScore: null,
        },
      ];

      jest
        .spyOn(service, 'listAdvisedPresentations')
        .mockResolvedValue(mockResponse);

      const result = await controller.listAdvisedPresentations(mockRequest);

      expect(result).toEqual(mockResponse);
      expect(service.listAdvisedPresentations).toHaveBeenCalledWith(mockUserId);
    });

    it('should handle empty response', async () => {
      const mockUserId = '123';
      const mockRequest = { user: { userId: mockUserId } };
      const mockResponse: Array<ListAdvisedPresentationsResponse> = [];

      jest
        .spyOn(service, 'listAdvisedPresentations')
        .mockResolvedValue(mockResponse);

      const result = await controller.listAdvisedPresentations(mockRequest);

      expect(result).toEqual([]);
      expect(service.listAdvisedPresentations).toHaveBeenCalledWith(mockUserId);
    });

    it('should throw an error if service throws an error', async () => {
      const mockUserId = '123';
      const mockRequest = { user: { userId: mockUserId } };
      const mockError = new AppException('Erro interno no servidor', 500);

      jest
        .spyOn(service, 'listAdvisedPresentations')
        .mockRejectedValue(mockError);

      await expect(
        controller.listAdvisedPresentations(mockRequest),
      ).rejects.toThrow('Erro interno no servidor');
      expect(service.listAdvisedPresentations).toHaveBeenCalledWith(mockUserId);
    });
  });
});
