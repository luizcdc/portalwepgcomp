import { Controller, Post, Body } from '@nestjs/common';
import { MailingService } from './mailing.service';
import {
  ContactRequestDto,
  ContactResponseDto,
  DefaultEmailResponseDto,
  DefaultEmailDto,
} from './mailing.dto';

@Controller('mailing')
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  @Post('/contact')
  async contact(
    @Body() contactDto: ContactRequestDto,
  ): Promise<ContactResponseDto> {
    return await this.mailingService.contact(contactDto);
  }

  @Post('/send')
  async send(
    @Body() sendDto: DefaultEmailDto,
  ): Promise<DefaultEmailResponseDto> {
    return await this.mailingService.sendEmail(sendDto);
  }
}
