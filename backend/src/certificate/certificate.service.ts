import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PageSizes, PDFDocument, PDFFont, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { AppException } from '../exceptions/app.exception';
import { CommitteeLevel, Profile, UserAccount } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

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
    const pdfBytes = await this.buidBaseCertificate(
      user.profile,
      eventEditionId,
    );
    return Buffer.from(pdfBytes);
  }

  private async buidBaseCertificate(
    userProfileType: string,
    eventEditionId: string,
  ): Promise<Uint8Array<ArrayBufferLike>> {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const page = pdfDoc.addPage([PageSizes.A4[1], PageSizes.A4[0]]);
    const lines = ['Universidade Federal da Bahia', 'Instituto de Computação'];
    const fontBytes = await fs.readFile(
      path.join(
        process.cwd(),
        'src/certificate/assets/SourceSerif4-Medium.ttf',
      ),
    );
    const font = await pdfDoc.embedFont(fontBytes);
    const textSize = 26;
    const lineHeight = textSize * 1.25;

    lines.forEach((line, index) => {
      const textWidth = font.widthOfTextAtSize(line, textSize);
      page.drawText(line, {
        x: page.getWidth() / 2 - textWidth / 2,
        y: page.getHeight() - (textSize + lineHeight * index) - 60,
        size: textSize,
        font: font,
      });
    });

    const third_smaller_line =
      'Programa de Pós-Graduação em Ciência da Computação';

    const third_smaller_line_width = font.widthOfTextAtSize(
      third_smaller_line,
      textSize / 1.4,
    );

    page.drawText(third_smaller_line, {
      x: page.getWidth() / 2 - third_smaller_line_width / 2,
      y: page.getHeight() - (textSize + lineHeight * 1.9) - 60,
      size: textSize / 1.4,
      font: font,
    });

    const fontTitleBytes = await fs.readFile(
      path.join(
        process.cwd(),
        'src/certificate/assets/SourceSerif4-SemiBold.ttf',
      ),
    );
    const fontTitle = await pdfDoc.embedFont(fontTitleBytes);
    const title =
      userProfileType == Profile.Professor
        ? 'CERTIFICADO DE AVALIADOR'
        : 'CERTIFICADO DE APRESENTAÇÃO';

    const title_width = font.widthOfTextAtSize(title, textSize);

    page.drawText(title, {
      x: page.getWidth() / 2 - title_width / 2,
      y: page.getHeight() - 230,
      size: textSize,
      font: fontTitle,
    });

    const pgcompImageBytes = await fs.readFile(
      path.join(process.cwd(), 'src/certificate/assets/pgcomp_ufba_logo.png'),
    );
    const ufbaImageBytes = await fs.readFile(
      path.join(process.cwd(), 'src/certificate/assets/brasao-ufba.png'),
    );
    const ufbaLowResImageBytes = await fs.readFile(
      path.join(
        process.cwd(),
        'src/certificate/assets/brasao-ufba-low-res.png',
      ),
    );

    const pgcompImage = await pdfDoc.embedPng(pgcompImageBytes);
    const ufbaImage = await pdfDoc.embedPng(ufbaImageBytes);
    const ufbaLowResImage = await pdfDoc.embedPng(ufbaLowResImageBytes);

    const pgcompDims = pgcompImage.scale(90 / pgcompImage.width);
    const ufbaDims = ufbaImage.scale(300 / ufbaImage.width);
    const ufbaLowResDims = ufbaLowResImage.scale(95 / ufbaLowResImage.width);

    page.drawImage(pgcompImage, {
      x: page.getWidth() - ufbaLowResDims.width - 50,
      y: page.getHeight() - ufbaLowResDims.height - 40,
      width: 90,
      height: pgcompDims.height,
    });

    page.drawImage(ufbaImage, {
      x: page.getWidth() / 2 - ufbaDims.width / 2,
      y: page.getHeight() / 2 - ufbaDims.height / 2,
      width: 300,
      height: ufbaDims.height,
      opacity: 0.18,
    });

    page.drawImage(ufbaLowResImage, {
      x: 50,
      y: page.getHeight() - pgcompDims.height - 40,
      width: 95,
      height: ufbaLowResDims.height,
    });

    await this.drawSignatures(page, pdfDoc, eventEditionId);

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }

  private async drawSignatures(
    page,
    pdfDoc: PDFDocument,
    eventEditionId: string,
  ) {
    const signatureLineSize = page.getWidth() / 6;
    page.drawLine({
      start: { x: page.getWidth() / 2 - signatureLineSize / 2, y: 115 },
      end: { x: page.getWidth() / 2 + signatureLineSize / 2, y: 115 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    page.drawLine({
      start: { x: signatureLineSize / 2, y: 115 },
      end: { x: signatureLineSize * 1.5, y: 115 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    page.drawLine({
      start: { x: page.getWidth() - signatureLineSize * 1.5, y: 115 },
      end: { x: page.getWidth() - signatureLineSize / 2, y: 115 },
    });

    // for now we don't have a signature, let's just place this image above each of the lines
    // as a placeholder
    const mockSignatureImageBytes = await fs.readFile(
      path.join(process.cwd(), 'src/certificate/assets/mock-signature.png'),
    );

    const mockSignatureImage = await pdfDoc.embedPng(mockSignatureImageBytes);

    const mockSignatureDims = mockSignatureImage.scale(
      135 / mockSignatureImage.width,
    );

    // Get the font for the names and roles
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;

    // Left signature
    page.drawImage(mockSignatureImage, {
      x: signatureLineSize - mockSignatureDims.width / 2,
      y: 120,
      width: 135,
      height: mockSignatureDims.height,
    });
    const leftName = 'Daniela Barreiro Claro';
    const leftRole = 'Coordenador(a) do PGCOMP';
    page.drawText(leftName, {
      x: signatureLineSize - font.widthOfTextAtSize(leftName, fontSize) / 2,
      y: 95,
      size: fontSize,
      font,
    });
    page.drawText(leftRole, {
      x: signatureLineSize - font.widthOfTextAtSize(leftRole, fontSize) / 2,
      y: 80,
      size: fontSize,
      font,
    });

    // Center signature
    page.drawImage(mockSignatureImage, {
      x: page.getWidth() / 2 - mockSignatureDims.width / 2,
      y: 120,
      width: 135,
      height: mockSignatureDims.height,
    });
    const centerName = 'Ivan do Carmo Machado';
    const centerRole = 'Diretor(a) do Instituto de Computação';
    page.drawText(centerName, {
      x: page.getWidth() / 2 - font.widthOfTextAtSize(centerName, fontSize) / 2,
      y: 95,
      size: fontSize,
      font,
    });
    page.drawText(centerRole, {
      x: page.getWidth() / 2 - font.widthOfTextAtSize(centerRole, fontSize) / 2,
      y: 80,
      size: fontSize,
      font,
    });

    // Right signature
    page.drawImage(mockSignatureImage, {
      x: page.getWidth() - signatureLineSize - mockSignatureDims.width / 2,
      y: 120,
      width: 135,
      height: mockSignatureDims.height,
    });
    const coordinator = await this.prismaClient.userAccount.findFirst({
      where: {
        committeeMemberships: {
          some: {
            level: CommitteeLevel.Coordinator,
            eventEditionId: eventEditionId,
          },
        },
      },
    });
    const rightName = coordinator.name;
    const rightRole = 'Coordenador(a) do WEPGCOMP';
    page.drawText(rightName, {
      x:
        page.getWidth() -
        signatureLineSize -
        font.widthOfTextAtSize(rightName, fontSize) / 2,
      y: 95,
      size: fontSize,
      font,
    });
    page.drawText(rightRole, {
      x:
        page.getWidth() -
        signatureLineSize -
        font.widthOfTextAtSize(rightRole, fontSize) / 2,
      y: 80,
      size: fontSize,
      font,
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
    // Handle public scores
    presentations.sort((a, b) => {
      const scoreA = a.publicAverageScore ?? 0;
      const scoreB = b.publicAverageScore ?? 0;
      return scoreB - scoreA;
    });

    let currentRank = 1;
    let currentScore = presentations[0]?.publicAverageScore ?? 0;
    const publicRanks = new Map();

    presentations.forEach((presentation, index) => {
      if (presentation.publicAverageScore !== currentScore) {
        currentRank = index + 1;
        currentScore = presentation.publicAverageScore ?? 0;
      }
      publicRanks.set(presentation.submissionId, currentRank);
    });

    // Handle evaluator scores
    presentations.sort((a, b) => {
      const scoreA = a.evaluatorsAverageScore ?? 0;
      const scoreB = b.evaluatorsAverageScore ?? 0;
      return scoreB - scoreA;
    });

    currentRank = 1;
    currentScore = presentations[0]?.evaluatorsAverageScore ?? 0;
    const evaluatorRanks = new Map();

    presentations.forEach((presentation, index) => {
      if (presentation.evaluatorsAverageScore !== currentScore) {
        currentRank = index + 1;
        currentScore = presentation.evaluatorsAverageScore ?? 0;
      }
      evaluatorRanks.set(presentation.submissionId, currentRank);
    });
    // Use int_max instead of 0
    const INT_MAX = 2 ** 31 - 1;
    return {
      userPublicAwardStandings: userSubmission
        ? publicRanks.get(userSubmission.id) || INT_MAX
        : INT_MAX,
      userEvaluatorsAwardStandings: userSubmission
        ? evaluatorRanks.get(userSubmission.id) || INT_MAX
        : INT_MAX,
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
