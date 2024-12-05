import { Test, TestingModule } from '@nestjs/testing';
import { MailingService } from './mailing.service';
import { EventEditionService } from '../event-edition/event-edition.service';
import { CommitteeMemberService } from '../committee-member/committee-member.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ContactService', () => {
  let service: MailingService;

  beforeEach(async () => {
    const mockEmailErrorService = {
      someMethod: jest.fn(),
    };
    const mockEmailServerLimitService = {
      someOtherMethod: jest.fn(),
    };
    const mockDeadQueueService = {
      yetAnotherMethod: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailingService,
        EventEditionService,
        CommitteeMemberService,
        PrismaService,
        { provide: 'EMAIL_ERROR_SERVICE', useValue: mockEmailErrorService },
        {
          provide: 'EMAIL_SERVER_LIMIT_SERVICE',
          useValue: mockEmailServerLimitService,
        },
        { provide: 'DEAD_QUEUE_SERVICE', useValue: mockDeadQueueService },
      ],
    }).compile();

    service = module.get<MailingService>(MailingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
