import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import {
  ContactRequestDto,
  ContactResponseDto,
  DefaultEmailDto,
  DefaultEmailResponseDto,
} from './mailing.dto';
import { EventEditionService } from '../event-edition/event-edition.service';
import { CommitteeMemberService } from '../committee-member/committee-member.service';
import { AppException } from '../exceptions/app.exception';

@Injectable()
export class MailingService {
  constructor(
    private eventEditionService: EventEditionService,
    private committeeMemberService: CommitteeMemberService,
  ) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(
    defaultEmailDto: DefaultEmailDto,
  ): Promise<DefaultEmailResponseDto> {
    try {
      const msg = {
        to: defaultEmailDto.to,
        from: defaultEmailDto.from || process.env.SENDGRID_FROM_EMAIL,
        subject: defaultEmailDto.subject,
        text: defaultEmailDto.text,
        html: defaultEmailDto.html,
      };

      await sgMail.send(msg);
      return { message: 'Email sent successfully' };
    } catch (error) {
      console.error('SendGrid error:', error);

      if (error.response) {
        const { statusCode } = error.response.body;

        switch (statusCode) {
          case 401:
            throw new AppException(
              'Erro de autenticação: API key inválida',
              403,
            );
          case 429:
            throw new AppException('Limite diário de emails excedido', 429);
          default:
            throw new AppException(
              `Erro no envio de email: ${error.message}`,
              500,
            );
        }
      }

      throw new AppException(`Erro inesperado: ${error.message}`, 500);
    }
  }

  async contact(contactDto: ContactRequestDto): Promise<ContactResponseDto> {
    const { name, email, text } = contactDto;

    const eventEdition = await this.eventEditionService.findActive();
    const coordinator =
      await this.committeeMemberService.findCurrentCoordinator(eventEdition.id);

    const msg = {
      to: coordinator.userEmail,
      from: process.env.SENDGRID_FROM_EMAIL,
      replyTo: email,
      subject: 'Contato: WEPGCOMP',
      text: `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${text}`,
      html: `
        <h3>Novo contato via WEPGCOMP</h3>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${text.replace(/\n/g, '<br>')}</p>
      `,
    };

    try {
      await sgMail.send(msg);
      return { message: 'Email sent successfully' };
    } catch (error) {
      console.error('SendGrid contact error:', error);

      if (error.response) {
        const { statusCode } = error.response.body;

        switch (statusCode) {
          case 401:
            throw new AppException(
              'Erro de autenticação: API key inválida',
              403,
            );
          case 429:
            throw new AppException('Limite diário de emails excedido', 429);
          default:
            throw new AppException(
              `Erro no envio de email: ${error.message}`,
              500,
            );
        }
      }

      throw new AppException(`Erro inesperado: ${error.message}`, 500);
    }
  }

  async sendEmailConfirmation(email: string, token: string): Promise<void> {
    const confirmationUrl = `${process.env.FRONTEND_URL}/users/confirm-email?token=${token}`;

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Confirmação de Cadastro',
      html: `
        <h2>Confirmação de Cadastro</h2>
        <p>Clique no link abaixo para confirmar seu cadastro:</p>
        <p><a href="${confirmationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirmar Cadastro</a></p>
        <p>Ou copie e cole este link no seu navegador:</p>
        <p>${confirmationUrl}</p>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('SendGrid confirmation error:', error);
      throw new AppException(
        `Erro ao enviar email de confirmação: ${error.message}`,
        500,
      );
    }
  }
}
