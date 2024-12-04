import { Test, TestingModule } from '@nestjs/testing';
import { GuidanceService } from './guidance.service';

describe('GuidanceService', () => {
  let service: GuidanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuidanceService],
    }).compile();

    service = module.get<GuidanceService>(GuidanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
