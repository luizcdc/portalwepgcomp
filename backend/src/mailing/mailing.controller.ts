import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MailingService } from './mailing.service';
import {
  ContactRequestDto,
  ContactResponseDto,
  DefaultEmailResponseDto,
  DefaultEmailDto,
} from './mailing.dto';
import { Public, UserLevels } from '../auth/decorators/user-level.decorator';
import { UserLevelGuard } from '../auth/guards/user-level.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserLevel } from '@prisma/client';

@Controller('mailing')
@UseGuards(JwtAuthGuard, UserLevelGuard)
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  @Public()
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  @Post('/contact')
  async contact(
    @Body() contactDto: ContactRequestDto,
  ): Promise<ContactResponseDto> {
    return await this.mailingService.contact(contactDto);
  }

  @Post('/send')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  async send(
    @Body() sendDto: DefaultEmailDto,
  ): Promise<DefaultEmailResponseDto> {
    return await this.mailingService.sendEmail(sendDto);
  }
}
