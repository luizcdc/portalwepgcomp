import { Test, TestingModule } from '@nestjs/testing';
import { PresentationBlockController } from './presentation-block.controller';
import { PresentationBlockService } from './presentation-block.service';

describe('PresentationBlockController', () => {
  let controller: PresentationBlockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresentationBlockController],
      providers: [PresentationBlockService],
    }).compile();

    controller = module.get<PresentationBlockController>(
      PresentationBlockController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
