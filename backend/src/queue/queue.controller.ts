import { Body, Controller, Post } from '@nestjs/common';
import { QueueService } from './queue.service';
import { ContactEmailErrorMessageDto, QueueMessageDto } from './queue.dto';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('send')
  async send(@Body() sendQueueMessageDto: QueueMessageDto) {
    const { id, data } = sendQueueMessageDto;
    return this.queueService.sendMessage(id, data);
  }

  @Post('send-email-error-message')
  async sendEmailErrorMessage(
    @Body() emailErrorMessageDto: ContactEmailErrorMessageDto,
  ) {
    return this.queueService.sendEmailErrorMessage(emailErrorMessageDto);
  }
}
