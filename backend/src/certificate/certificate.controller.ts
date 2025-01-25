import {
  Controller,
  Get,
  Param,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { Response } from 'express';
import { UserLevels } from '../auth/decorators/user-level.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserLevelGuard } from '../auth/guards/user-level.guard';
import { UserLevel } from '@prisma/client';
@Controller('certificate')
@UseGuards(JwtAuthGuard, UserLevelGuard)
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Get('event-edition/:eventEditionId')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  async downloadCertificate(
    @Request() req: any,
    @Res() res: Response,
    @Param('eventEditionId') eventEditionId: string,
  ) {
    const pdfBuffer = await this.certificateService.generateCertificateForUser(
      req.user.userId,
      eventEditionId,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=certificate.pdf',
    });
    res.send(pdfBuffer);
  }
}
