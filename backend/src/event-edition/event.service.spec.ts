import { Test, TestingModule } from '@nestjs/testing';
import { EventEditionService } from './event-edition.service';

describe('EventEditionService', () => {
  let service: EventEditionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventEditionService],
    }).compile();

    service = module.get<EventEditionService>(EventEditionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
