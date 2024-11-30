import { Test, TestingModule } from '@nestjs/testing';
import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';

describe('MailingController', () => {
  let controller: MailingController;
  let service: MailingService;

  const mockMailingService = {
    create: jest.fn().mockResolvedValue({}),
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    remove: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailingController],
      providers: [
        {
          provide: MailingService,
          useValue: mockMailingService,
        },
      ],
    }).compile();

    controller = module.get<MailingController>(MailingController);
    service = module.get<MailingService>(MailingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
