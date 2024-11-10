import { Test, TestingModule } from '@nestjs/testing';
import { PresentationBlockService } from './presentation-block.service';

describe('PresentationBlockService', () => {
  let service: PresentationBlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresentationBlockService],
    }).compile();

    service = module.get<PresentationBlockService>(PresentationBlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
