import { Test, TestingModule } from '@nestjs/testing';
import { AwardedDoctoralStudentsController } from './awarded-doctoral-students.controller';
import { AwardedDoctoralStudentsService } from './awarded-doctoral-students.service';

describe('AwardedDoctoralStudentsController', () => {
  let controller: AwardedDoctoralStudentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AwardedDoctoralStudentsController],
      providers: [AwardedDoctoralStudentsService],
    }).compile();

    controller = module.get<AwardedDoctoralStudentsController>(AwardedDoctoralStudentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
