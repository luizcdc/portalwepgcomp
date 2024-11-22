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

@Injectable()
export class MailingService {
  private mailerTransport: Transporter;
  private queueService: QueueService;

  constructor(
    @Inject('EMAIL_ERROR_SERVICE') private errorClient: ClientProxy,
    @Inject('EMAIL_SERVER_LIMIT_SERVICE')
    private serverLimitClient: ClientProxy,
    @Inject('DEAD_QUEUE_SERVICE') private deadQueueClient: ClientProxy,
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
      return { message: await this.handleEmailError(e, defaultEmailDto) };
    }

    return { message: 'Email sent successfully' };
  }

  private async handleEmailError(
    error: any,
    email: DefaultEmailDto,
    retries: number = 0,
  ): Promise<string> {
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
        return 'Authentication error: Username and password not accepted';
      case 550:
        this.queueService.sendEmailServerLimitMessage({
          ...email,
          retries,
        });
        return 'Daily email quota exceeded';
    }

    this.queueService.sendEmailErrorMessage({
      ...email,
      error,
      retries,
    });
    return `Unexpected error: ${error}`;
  }

  async contact(
    contactDto: ContactRequestDto,
    retries: number = 0,
  ): Promise<ContactResponseDto> {
    const { name, email, text } = contactDto;

    const emailContent = {
      from: `"${name}" <${email}>`,
      cc: email,
      to: process.env.ORGANIZER_EMAIL,
      subject: 'Contato: WEPGCOMP',
      text,
    };

    try {
      await this.mailerTransport.sendMail(emailContent);
    } catch (e) {
      return { message: await this.handleEmailError(e, emailContent, retries) };
    }

    return { message: 'Email sent successfully' };
  }
}
