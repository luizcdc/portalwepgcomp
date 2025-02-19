import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ContactRequestDto,
  ContactResponseDto,
  DefaultEmailDto,
  DefaultEmailResponseDto,
} from './mailing.dto';
import { QueueService } from '../queue/queue.service';
import { createTransport, Transporter } from 'nodemailer';
import { EventEditionService } from '../event-edition/event-edition.service';
import { CommitteeMemberService } from '../committee-member/committee-member.service';
import { AppException } from '../exceptions/app.exception';

@Injectable()
export class MailingService {
  private mailerTransport: Transporter;
  private queueService: QueueService;

  constructor(
    @Inject('EMAIL_ERROR_SERVICE') private errorClient: ClientProxy,
    @Inject('EMAIL_SERVER_LIMIT_SERVICE')
    private serverLimitClient: ClientProxy,
    @Inject('DEAD_QUEUE_SERVICE') private deadQueueClient: ClientProxy,
    private eventEditionService: EventEditionService,
    private committeeMemberService: CommitteeMemberService,
  ) {
    this.mailerTransport = createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    this.queueService = new QueueService(
      errorClient,
      serverLimitClient,
      deadQueueClient,
    );
  }

  async sendEmail(
    defaultEmailDto: DefaultEmailDto,
  ): Promise<DefaultEmailResponseDto> {
    try {
      await this.mailerTransport.sendMail(defaultEmailDto);
    } catch (e) {
      const { message, status } = await this.handleEmailError(
        e,
        defaultEmailDto,
      );

      throw new AppException(message, status);
    }

    return { message: 'Email sent successfully' };
  }

  private async handleEmailError(
    error: any,
    email: DefaultEmailDto,
    retries: number = 0,
  ): Promise<{ message: string; status: number }> {
    if (retries >= 3) {
      this.queueService.sendMessageToDeadQueue({ ...email, error });
    }

    switch (error.responseCode) {
      case 535:
        this.queueService.sendEmailErrorMessage({
          ...email,
          error,
          retries,
        });
        return {
          message: 'Erro de autenticação: Nome de usuário e senha não aceitos',
          status: 403,
        };
      case 550:
        this.queueService.sendEmailServerLimitMessage({
          ...email,
          retries,
        });
        return { message: 'Limite diário de emails excedido', status: 429 };
    }

    this.queueService.sendEmailErrorMessage({
      ...email,
      error,
      retries,
    });
    return { message: `Erro inesperado: ${error}`, status: 500 };
  }

  async contact(
    contactDto: ContactRequestDto,
    retries: number = 0,
  ): Promise<ContactResponseDto> {
    const { name, email, text } = contactDto;

    const eventEdition = await this.eventEditionService.findActive();

    const coordinator =
      await this.committeeMemberService.findCurrentCoordinator(eventEdition.id);

    const emailContent = {
      from: `"${name}" <${email}>`,
      cc: email,
      to: coordinator.userEmail,
      subject: 'Contato: WEPGCOMP',
      text,
    };

    try {
      await this.mailerTransport.sendMail(emailContent);
    } catch (e) {
      const { message, status } = await this.handleEmailError(
        e,
        emailContent,
        retries,
      );

      throw new AppException(message, status);
    }

    return { message: 'Email sent successfully' };
  }

  async sendEmailConfirmation(email: string, token: string): Promise<void> {
    const confirmationUrl = `${process.env.FRONTEND_URL}/users/confirm-email?token=${token}`;
    const subject = 'Confirmação de Cadastro';
    const html = `<p>Clique no link para confirmar seu cadastro: <a href="${confirmationUrl}">${confirmationUrl}</a></p>`;

    await this.mailerTransport.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject,
      html,
    });
  }
}
