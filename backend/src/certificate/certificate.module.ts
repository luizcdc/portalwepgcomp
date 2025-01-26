import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { MailingModule } from 'src/mailing/mailing.module';

@Module({
  controllers: [CertificateController],
  providers: [CertificateService],
  imports: [MailingModule],
})
export class CertificateModule {}
