import { Test, TestingModule } from '@nestjs/testing';
import { S3UtilsController } from './s3-utils.controller';
import { S3UtilsService } from './s3-utils.service';

describe('S3UtilsController', () => {
  let controller: S3UtilsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [S3UtilsController],
      providers: [S3UtilsService],
    }).compile();

    controller = module.get<S3UtilsController>(S3UtilsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
