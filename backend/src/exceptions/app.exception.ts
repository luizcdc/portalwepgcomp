import { HttpException } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(message: string, code: number) {
    super(message, code);
  }
}
