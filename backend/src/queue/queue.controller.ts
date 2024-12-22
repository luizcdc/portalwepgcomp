import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { QueueService } from './queue.service';
import { ContactEmailErrorMessageDto, QueueMessageDto } from './queue.dto';
import { UserLevels } from '../auth/decorators/user-level.decorator';
import { UserLevel } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserLevelGuard } from '../auth/guards/user-level.guard';

@Controller('queue')
@UseGuards(JwtAuthGuard, UserLevelGuard)
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('send')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  async send(@Body() sendQueueMessageDto: QueueMessageDto) {
    const { id, data } = sendQueueMessageDto;
    return this.queueService.sendMessage(id, data);
  }

  @Post('send-email-error-message')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  async sendEmailErrorMessage(
    @Body() emailErrorMessageDto: ContactEmailErrorMessageDto,
  ) {
    return this.queueService.sendEmailErrorMessage(emailErrorMessageDto);
  }
}
