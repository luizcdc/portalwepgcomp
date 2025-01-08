import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';

@Module({
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule {}
