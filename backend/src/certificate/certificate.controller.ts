import { Controller, Get, Header, Res } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { Response } from 'express';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Get()
  @Header('Content-Type', 'application/pdf')
  async helloWorld(@Res() res: Response) {
    const pdfBuffer = await this.certificateService.helloWorld();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=certificate.pdf',
    });
    res.send(pdfBuffer);
  }
}
