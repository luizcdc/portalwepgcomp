import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import { AppException } from '../exceptions/app.exception';
import { Profile } from '@prisma/client';

@Injectable()
export class CertificateService {
  constructor(private prismaClient: PrismaService) {}

  async generateCertificateForUser(
    userId: string,
    eventEditionId: string,
  ): Promise<Buffer> {
    // Info to get: nome, current event's presentation title, current event's title, current event's start and end date.
    // Whether they were awarded or not. (just get the 3 max score submissions and see if theirs is one of them)
    // TODO: Use Certificate database row to return existing file, if it exists.
    const user = await this.prismaClient.userAccount.findUnique({
      where: { id: userId },
      include: {
        panelistParticipations: {
          where: {
            presentationBlock: {
              eventEditionId: eventEditionId,
            },
          },
        },
        mainAuthored: {
          where: {
            eventEditionId,
          },
        },
        panelistAwards: {
          where: {
            eventEditionId,
          },
        },
      },
    });
    const eventEdition = await this.prismaClient.eventEdition.findUnique({
      where: { id: eventEditionId },
      include: {
        certificates: true,
        // TODO: when prisma is fixed, use this instead of the above line
        // certificates: {
        //   where: { userId },
        // }
      },
    });
    console.log(user);
    console.log(eventEdition);
    if (!user) {
      throw new AppException('Usuário não encontrado', 404);
    } else if (!eventEdition) {
      throw new AppException('Edição do evento não encontrada', 404);
    }
    if (user.profile === Profile.Listener) {
      throw new AppException(
        'Usuário não participou como apresentador ou avaliador, portanto não pode receber certificado',
        400,
      );
    } else if (
      user.profile === Profile.DoctoralStudent &&
      !user.mainAuthored?.length
      // TODO: check presentation status
    ) {
      throw new AppException(
        'Doutorando não tem submissões, portanto não pode receber certificado',
        400,
      );
    } else if (
      user.profile === Profile.Professor &&
      !user.panelistParticipations?.length
    ) {
      throw new AppException(
        'Professor não foi premiado, portanto não pode receber certificado',
        400,
      );
    }
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
