import { Test, TestingModule } from '@nestjs/testing';
import { EventEditionController } from './event-edition.controller';

describe('EventEditionController', () => {
  let controller: EventEditionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventEditionController],
    }).compile();

    controller = module.get<EventEditionController>(EventEditionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
