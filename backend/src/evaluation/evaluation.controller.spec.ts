import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationController } from './evaluation.controller';

describe('EvaluationController', () => {
  let controller: EvaluationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluationController],
    }).compile();

    controller = module.get<EvaluationController>(EvaluationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
