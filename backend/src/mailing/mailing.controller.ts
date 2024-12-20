import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MailingService } from './mailing.service';
import {
  ContactRequestDto,
  ContactResponseDto,
  DefaultEmailResponseDto,
  DefaultEmailDto,
} from './mailing.dto';
import { UserLevels } from '../auth/decorators/user-level.decorator';
import { UserLevelGuard } from '../auth/guards/user-level.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserLevel } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('mailing')
@UseGuards(JwtAuthGuard, UserLevelGuard)
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  @Post('/contact')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  @ApiBearerAuth()
  async contact(
    @Body() contactDto: ContactRequestDto,
  ): Promise<ContactResponseDto> {
    return await this.mailingService.contact(contactDto);
  }

  @Post('/send')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  @ApiBearerAuth()
  async send(
    @Body() sendDto: DefaultEmailDto,
  ): Promise<DefaultEmailResponseDto> {
    return await this.mailingService.sendEmail(sendDto);
  }
}
