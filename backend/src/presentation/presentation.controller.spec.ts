import { Test, TestingModule } from '@nestjs/testing';
import { PresentationController } from './presentation.controller';
import { PresentationService } from './presentation.service';

describe('PresentationController', () => {
  let controller: PresentationController;
  let service: PresentationService;

  const mockPresentationService = {
    create:  jest.fn().mockResolvedValue({}),
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue([]),
    update:  jest.fn().mockResolvedValue([]),
    remove:  jest.fn().mockResolvedValue([]),
  }

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
});
