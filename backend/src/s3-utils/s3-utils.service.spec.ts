import { Test, TestingModule } from '@nestjs/testing';
import { S3UtilsService } from './s3-utils.service';

describe('S3UtilsService', () => {
  let service: S3UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3UtilsService],
    }).compile();

    service = module.get<S3UtilsService>(S3UtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
