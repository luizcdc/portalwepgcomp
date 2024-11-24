import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';

describe('SubmissionController', () => {
  let controller: SubmissionController;
  let service: SubmissionService;

  const mockSubmissionService = {
    create:  jest.fn().mockResolvedValue({}),
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue([]),
    update:  jest.fn().mockResolvedValue([]),
    remove:  jest.fn().mockResolvedValue([]),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmissionController],
      providers: [
        {
          provide: SubmissionService,
          useValue: mockSubmissionService,
          },
      ],
    }).compile();

    controller = module.get<SubmissionController>(SubmissionController);
    service = module.get<SubmissionService>(SubmissionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
