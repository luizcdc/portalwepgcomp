import { Test, TestingModule } from '@nestjs/testing';
import { TesteService } from './teste.service';

describe('TesteService', () => {
  let service: TesteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TesteService],
    }).compile();

    service = module.get<TesteService>(TesteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
