import { Test, TestingModule } from '@nestjs/testing';
import { S3UtilsController } from './s3-utils.controller';
import { S3UtilsService } from './s3-utils.service';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('855e104e-349d-4d0a-8a7f-0028f01f2edf'),
}));

describe('S3UtilsController', () => {
  let controller: S3UtilsController;
  let service: S3UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [S3UtilsController],
      providers: [
        {
          provide: S3UtilsService,
          useValue: {
            listFiles: jest.fn().mockResolvedValue(['file1', 'file2']),
            uploadFile: jest.fn().mockResolvedValue({
              message: 'Arquivo carregado com sucesso!',
              key: `${uuidv4()}.pdf`,
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<S3UtilsController>(S3UtilsController);
    service = module.get<S3UtilsService>(S3UtilsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listFiles', () => {
    it('should return a list of files', async () => {
      const files = await controller.listFiles();
      expect(files).toEqual(['file1', 'file2']);
    });
  });

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('test data'),
        destination: '',
        filename: '',
        path: '',
        stream: undefined,
      };

      const result = await controller.uploadFile(mockFile);

      expect(result).toEqual({
        message: 'Arquivo carregado com sucesso!',
        key: '855e104e-349d-4d0a-8a7f-0028f01f2edf.pdf',
      });
    });
  });
});
