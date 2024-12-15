import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { S3UtilsService } from './s3-utils.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { v4 } from 'uuid';
import { AppException } from 'src/exceptions/app.exception';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';

@Controller('s3-utils')
@UseGuards(ThrottlerGuard) // Habilita o rate limiter
export class S3UtilsController {
  constructor(private readonly s3UtilsService: S3UtilsService) {}

  @Get('list')
  async listFiles() {
    const files = await this.s3UtilsService.listFiles();
    return files;
  }

  @Post()
  @Throttle({
    default: {
      limit: 5, // The maximum number of requests within the TTL limit
      ttl: 60, // The number of milliseconds that each request will last in storage
      blockDuration: 60000, // The number of milliseconds that request will be blocked for that time -> Currently 1 min
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data') // Specify the content type
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload a file to S3' })
  @ApiResponse({ status: 200, description: 'Arquivo carregado com sucesso!' })
  @ApiResponse({
    status: 500,
    description: 'Erro no carregamento do arquivo',
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 51200000 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const key = v4() + '.pdf';
    const response = await this.s3UtilsService.uploadFile(file, key);
    if (!response) throw new AppException('Error uploading file to S3', 500);
    return {
      message: 'Arquivo carregado com sucesso!',
      key,
    };
  }
}
