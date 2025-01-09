import { Test, TestingModule } from '@nestjs/testing';
import { ScoringService } from './scoring.service';
import { EvaluationStats } from './interfaces/evaluation-stats.interface';

describe('ScoringService', () => {
  let service: ScoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScoringService],
    }).compile();

    service = module.get<ScoringService>(ScoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateWilsonScore', () => {
    it('should return 0 for no ratings', () => {
      const stats: EvaluationStats = {
        totalScore: 0,
        numberOfRatings: 0,
        scores: {},
      };
      expect(service.calculateWilsonScore(stats)).toBe(0);
    });

    it('should calculate correct Wilson score for multiple ratings', () => {
      const stats: EvaluationStats = {
        totalScore: 27,
        numberOfRatings: 6,
        scores: {
          5: 3,
          4: 3,
        },
      };
      const score = service.calculateWilsonScore(stats);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(5);
    });
  });
});
