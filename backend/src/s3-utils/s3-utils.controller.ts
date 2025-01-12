import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
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
import { AppException } from '../exceptions/app.exception';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('s3-utils')
export class S3UtilsController {
  constructor(
    private readonly s3UtilsService: S3UtilsService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get('list')
  async listFiles() {
    const files = await this.s3UtilsService.listFiles();
    return files;
  }

  @Post()
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

  @Post('cleanup-unlinked-pdfs')
  async cleanupUnlinkedPdfs() {
    const deletedFiles = await this.s3UtilsService.deleteUnlinkedPdfFiles();
    if (deletedFiles.length > 0) {
      return {
        message: 'PDF files without submission were removed successfully.',
        deletedFiles,
      };
    } else {
      return {
        message: 'No PDF files were removed.',
      };
    }
  }
}
