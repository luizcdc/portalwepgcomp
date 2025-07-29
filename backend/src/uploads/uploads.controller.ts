import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { createReadStream, existsSync } from 'fs';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('uploads')
export class UploadsController {
  @Post()
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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Folder where files will be stored
        filename: (req, file, callback) => {
          const uniqueFilename = uuidv4() + extname(file.originalname);
          callback(null, uniqueFilename);
        },
      }),
    }),
  )
  uploadFile(
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
    return {
      message: 'File uploaded successfully',
      key: file.filename, // Return the UUID-based filename as the key
    };
  }

  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'uploads', filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    const file = createReadStream(filePath);
    file.pipe(res);
  }

  @Get()
  findAll() {
    // Placeholder for retrieving a list of uploads
    return { message: 'List of uploads' };
  }
}
