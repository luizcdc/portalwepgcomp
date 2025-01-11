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
        certificates: {
          where: { eventEditionId },
        },
      },
    });
    const eventEdition = await this.prismaClient.eventEdition.findUnique({
      where: { id: eventEditionId },
    });
    const presentations = await this.prismaClient.presentation.findMany({
      where: {
        presentationBlock: {
          eventEditionId,
        },
      },
    });
    const userSubmission = user.mainAuthored?.[0];

    this.validateUserEligibility(user, eventEdition);
    const { userPublicAwardStandings, userEvaluatorsAwardStandings } =
      this.calculateAwardStandings(presentations, userSubmission);

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

  /**
   * Calculates the award results for a user's presentation based on public and evaluator scores
   * @param presentations - Array of presentations containing scoring information
   * @param userSubmission - The specific user's submission to find standings for
   * @returns An object containing:
   *  - userPublicAwardStandings: The user's standing based on public average scores (1-based index)
   *  - userEvaluatorsAwardStandings: The user's standing based on evaluators average scores (1-based index)
   */
  private calculateAwardStandings(presentations, userSubmission) {
    presentations.sort((a, b) => {
      const scoreA = a.publicAverageScore ?? 0;
      const scoreB = b.publicAverageScore ?? 0;
      return scoreB - scoreA;
    });
    const userPublicAwardStandings =
      presentations.findIndex(
        (presentation) => presentation.submissionId === userSubmission?.id,
      ) + 1;
    presentations.sort((a, b) => {
      const scoreA = a.evaluatorsAverageScore ?? 0;
      const scoreB = b.evaluatorsAverageScore ?? 0;
      return scoreB - scoreA;
    });
    const userEvaluatorsAwardStandings =
      presentations.findIndex(
        (presentation) => presentation.submissionId === userSubmission?.id,
      ) + 1;
    return {
      userPublicAwardStandings,
      userEvaluatorsAwardStandings,
    };
  }

  /**
   * Validates if a user is eligible to receive a certificate based on their profile and participation.
   *
   * @param user - The user object containing profile and participation information
   * @param eventEdition - The event edition object to validate against
   *
   * @throws {AppException}
   * - When user is not found (404)
   * - When event edition is not found (404)
   * - When user is a Listener profile (400)
   * - When user is a Doctoral Student without submissions (400)
   * - When user is a Professor without panel participations (400)
   *
   * @private
   */
  private validateUserEligibility(user, eventEdition) {
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
      // TODO: check presentation status when we're certain that it's being updated
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
        // TODO: certificado para comissão se não participar de mesas avaliadoras? Tirar dúvida com
        // Fred
        'Professor não participou de mesas avaliadoras, portanto não pode receber certificado',
        400,
      );
    }
  }
}
