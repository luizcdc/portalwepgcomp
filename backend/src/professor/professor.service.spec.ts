import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorService } from './professor.service';

describe('ProfessorService', () => {
  let service: ProfessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfessorService],
    }).compile();

    service = module.get<ProfessorService>(ProfessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
