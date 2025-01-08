import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import PDFDocument from 'pdfkit';

@Injectable()
export class CertificateService {
  constructor(private prismaClient: PrismaService) {}

  async helloWorld(): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
      });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.image('./src/certificate/assets/pgcomp_ufba_logo.png', 0, 200, {
        fit: [250, 250],
      });

      doc.text('Hello World');
      doc.end();
    });
  }
}
