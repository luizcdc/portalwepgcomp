import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationService } from './evaluation.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('EvaluationService', () => {
  let service: EvaluationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvaluationService, PrismaService],
    }).compile();

    service = module.get<EvaluationService>(EvaluationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
