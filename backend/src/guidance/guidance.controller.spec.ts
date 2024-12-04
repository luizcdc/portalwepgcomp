import { Test, TestingModule } from '@nestjs/testing';
import { GuidanceController } from './guidance.controller';

describe('GuidanceController', () => {
  let controller: GuidanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuidanceController],
    }).compile();

    controller = module.get<GuidanceController>(GuidanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
