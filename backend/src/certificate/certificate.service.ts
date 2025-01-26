import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PageSizes, PDFDocument, PDFFont, rgb, TextAlignment } from 'pdf-lib';
import * as fontkit from '@pdf-lib/fontkit';
import { AppException } from '../exceptions/app.exception';
import { CommitteeLevel, Profile } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailingService } from '../mailing/mailing.service';

@Injectable()
export class CertificateService {
  private readonly fontsPaths = {
    bold: './assets/SourceSerif4-Bold.ttf',
    regular: './assets/SourceSerif4-Regular.ttf',
    semibold: './assets/SourceSerif4-SemiBold.ttf',
    italic: './assets/SourceSerif4-Italic.ttf',
    medium: './assets/SourceSerif4-Medium.ttf',
    // bolditalic: 'src/certificate/assets/SourceSerif4-BoldItalic.ttf',
    bolditalic: './assets/SourceSerif4-BoldItalic.ttf',
  };
  constructor(
    private prismaClient: PrismaService,
    private mailingService: MailingService,
  ) {}

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

    await this.validateUserEligibility(user, eventEdition);

    const { userPublicAwardStandings, userEvaluatorsAwardStandings } =
      this.calculateAwardStandings(presentations, userSubmission);
    const fonts = {
      bold: null,
      regular: null,
      semibold: null,
      italic: null,
      medium: null,
      bolditalic: null,
    };
    const { pdfDoc, page } = await this.buildBaseCertificate(
      fonts,
      user.profile,
      eventEditionId,
      eventEdition.name,
    );
    let texto = '';
    if (user.profile == Profile.Professor) {
      texto += `   Certificamos que ${user.name} participou como avaliador(a) em sessões de apresentações do evento ${eventEdition.name}, promovido pelo Programa de Pós-Graduação em Ciência da Computação do Instituto de Computação da Universidade Federal da Bahia, no período de ${eventEdition.startDate.toLocaleDateString()} a ${eventEdition.endDate.toLocaleDateString()}.`;
      if (user.panelistAwards.length) {
        texto += ` Também ficamos felizes de informar que ${user.name} foi homenageado(a) como um dos melhores avaliadores pela comissão organizadora do ${eventEdition.name}.`;
      }
    } else {
      texto += `    Certificamos que ${user.name} apresentou o trabalho de título "${userSubmission.title}" na categoria Apresentação Oral do evento ${eventEdition.name}, promovido pelo Programa de Pós-Graduação em Ciência da Computação do Instituto de Computação da Universidade Federal da Bahia, no período de ${eventEdition.startDate.toLocaleDateString()} a ${eventEdition.endDate.toLocaleDateString()}.`;
      if (userPublicAwardStandings <= 3 && userEvaluatorsAwardStandings <= 3) {
        texto += ` O trabalho de ${user.name} recebeu o prêmio Escolha do Público, classificado em ${userPublicAwardStandings}º lugar na avaliação dos membros do público. Seu trabalho também recebeu o prêmio Escolha dos Avaliadores, sendo classificado em ${userEvaluatorsAwardStandings}º lugar na avaliação da banca avaliadora.`;
      } else if (userPublicAwardStandings <= 3) {
        texto += ` O trabalho de ${user.name} recebeu o prêmio Escolha do Público, classificado em ${userPublicAwardStandings}º lugar na avaliação dos membros do público.`;
      } else if (userEvaluatorsAwardStandings <= 3) {
        texto += ` O trabalho de ${user.name} recebeu o prêmio Escolha dos Avaliadores, sendo classificado em ${userEvaluatorsAwardStandings}º lugar na avaliação da banca avaliadora.`;
      }
    }
    const regularFont = await this.getFontAndEmbed(fonts, 'regular', pdfDoc);
    page.drawText(texto, {
      x: 50,
      y: 330,
      size: 16,
      font: regularFont,
      maxWidth: page.getWidth() - 50,
      lineHeight: 19,
    });
    // Always use the date of the end of the event
    const placeAndTime = `Salvador, Bahia, ${eventEdition.endDate.getDate()} de ${new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(eventEdition.endDate)} de ${eventEdition.endDate.getFullYear()}.`;
    // Get the size of the text to center it
    const placeAndTimeWidth = regularFont.widthOfTextAtSize(placeAndTime, 16);
    page.drawText(placeAndTime, {
      x: page.getWidth() - placeAndTimeWidth - 50,
      y: 185,
      size: 16,
      font: regularFont,
    });
    return Buffer.from(await pdfDoc.save());
  }

  private async getFontAndEmbed(
    embeddedFonts: {
      bold: null | PDFFont;
      regular: null | PDFFont;
      semibold: null | PDFFont;
      italic: null | PDFFont;
      medium: null | PDFFont;
      bolditalic: null | PDFFont;
    },
    fontType: string,
    pdfDoc: PDFDocument,
  ): Promise<PDFFont> {
    if (embeddedFonts[fontType] == null) {
      const fontBytes = await fs.readFile(
        path.join(process.cwd(), this.fontsPaths[fontType]),
      );
      embeddedFonts[fontType] = await pdfDoc.embedFont(fontBytes);
    }
    return embeddedFonts[fontType];
  }

  private async buildBaseCertificate(
    fonts: {
      bold: null | PDFFont;
      regular: null | PDFFont;
      semibold: null | PDFFont;
      italic: null | PDFFont;
      medium: null | PDFFont;
      bolditalic: null | PDFFont;
    },
    userProfileType: string,
    eventEditionId: string,
    eventEditionName: string,
  ): Promise<{ pdfDoc: PDFDocument; page: any }> {
    const pdfDoc = await PDFDocument.create();

    pdfDoc.registerFontkit(fontkit);
    this.setPdfMetadata(pdfDoc, userProfileType, eventEditionName);
    const page = pdfDoc.addPage([PageSizes.A4[1], PageSizes.A4[0]]);
    await this.renderCertificateHeader(fonts, pdfDoc, page, userProfileType);

    await this.drawSignatures(page, fonts, pdfDoc, eventEditionId);
    return { pdfDoc, page };
  }

  private async renderCertificateHeader(
    fonts: {
      bold: null | PDFFont;
      regular: null | PDFFont;
      semibold: null | PDFFont;
      italic: null | PDFFont;
      medium: null | PDFFont;
      bolditalic: null | PDFFont;
    },
    pdfDoc: PDFDocument,
    page,
    userProfileType: string,
  ) {
    const lines = ['Universidade Federal da Bahia', 'Instituto de Computação'];
    const font = await this.getFontAndEmbed(fonts, 'medium', pdfDoc);
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

    const fontTitle = await this.getFontAndEmbed(fonts, 'semibold', pdfDoc);
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
      opacity: 0.16,
    });

    page.drawImage(ufbaLowResImage, {
      x: 50,
      y: page.getHeight() - pgcompDims.height - 40,
      width: 95,
      height: ufbaLowResDims.height,
    });
  }

  private setPdfMetadata(
    pdfDoc: PDFDocument,
    userProfileType: string,
    eventEditionName: string,
  ) {
    pdfDoc.setTitle(`Certificado de ${userProfileType} - ${eventEditionName}`);
    pdfDoc.setSubject(
      'Certificado de participação no ' + eventEditionName + '.',
    );
    pdfDoc.setProducer('Portal WEPGCOMP');
    pdfDoc.setCreator('Portal WEPGCOMP');
    pdfDoc.setAuthor(
      'Programa de Pós-Graduação em Ciência da Computação do IC-UFBA',
    );
  }

  private async drawSignatures(
    page,
    fonts: {
      bold: null | PDFFont;
      regular: null | PDFFont;
      semibold: null | PDFFont;
      italic: null | PDFFont;
      medium: null | PDFFont;
      bolditalic: null | PDFFont;
    },
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
    const font = await this.getFontAndEmbed(fonts, 'regular', pdfDoc);
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
      x: signatureLineSize - 150 / 2,
      y: 80,
      size: fontSize,
      font,
      maxWidth: 150,
      lineHeight: fontSize * 1.2,
      align: TextAlignment.Center,
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
  public calculateAwardStandings(presentations, userSubmission) {
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
   */
  public async validateUserEligibility(user, eventEdition) {
    if (!user) {
      throw new AppException('Usuário não encontrado', 404);
    } else if (!eventEdition) {
      throw new AppException('Edição do evento não encontrada', 404);
    }
    if (user.profile === Profile.Listener) {
      throw new AppException(
        'Usuário não participou como apresentador ou avaliador, portanto não pode receber certificado',
        404,
      );
    } else if (
      user.profile === Profile.DoctoralStudent &&
      !user.mainAuthored?.length
      // TODO: check presentation status when we're certain that it's being updated
    ) {
      throw new AppException(
        'Doutorando não tem submissões, portanto não pode receber certificado',
        404,
      );
    } else if (
      user.profile === Profile.Professor &&
      !user.panelistParticipations?.length
    ) {
      throw new AppException(
        // TODO: certificado para comissão se não participar de mesas avaliadoras? Tirar dúvida com
        // Fred
        'Professor não participou de mesas avaliadoras, portanto não pode receber certificado',
        404,
      );
    }
    if (eventEdition.endDate > new Date()) {
      throw new AppException(
        'Evento ainda não terminou, portanto certificados não estão disponíveis',
        404,
      );
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const oneDayBefore = new Date();
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);
    oneDayBefore.setHours(0, 0, 0, 0);
    const oneDayBeforeAdjusted = new Date(
      oneDayBefore.getTime() - oneDayBefore.getTimezoneOffset() * 60000,
    );
    const nextDay = new Date(oneDayBeforeAdjusted);
    nextDay.setDate(nextDay.getDate() + 1);
    const events = await this.prismaClient.eventEdition.findMany({
      where: {
        isActive: true,
        endDate: {
          gte: oneDayBeforeAdjusted,
          lt: nextDay,
        },
      },
    });
    for (const event of events) {
      const users = await this.prismaClient.userAccount.findMany({
        include: {
          panelistParticipations: {
            where: {
              presentationBlock: {
                eventEditionId: event.id,
              },
            },
          },
          mainAuthored: {
            where: {
              eventEditionId: event.id,
            },
          },
          panelistAwards: {
            where: {
              eventEditionId: event.id,
            },
          },
          certificates: {
            where: { eventEditionId: event.id },
          },
        },
      });
      for (const user of users) {
        try {
          await this.validateUserEligibility(user, event);

          const text = `Seu certificado já está pronto para ser baixado na página do WEPGCOMP!`;
          const CertificateEmail = {
            from: `"${user.name}" <${user.email}>`,
            to: user.email,
            subject: 'Certificado',
            text,
          };
          this.mailingService.sendEmail(CertificateEmail);
        } catch {}
      }
    }
  }
}
