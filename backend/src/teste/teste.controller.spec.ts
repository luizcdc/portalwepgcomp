import { Test, TestingModule } from '@nestjs/testing';
import { TesteController } from './teste.controller';
import { TesteService } from './teste.service';

describe('TesteController', () => {
  let controller: TesteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TesteController],
      providers: [TesteService],
    }).compile();

    controller = module.get<TesteController>(TesteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
