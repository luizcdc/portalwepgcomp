import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ContactEmailErrorMessageDto,
  ContactEmailServerLimitMessageDto,
  QueueMessageResponseDto,
} from './queue.dto';

@Injectable()
export class QueueService {
  constructor(
    @Inject('EMAIL_ERROR_SERVICE') private errorClient: ClientProxy,
    @Inject('EMAIL_SERVER_LIMIT_SERVICE')
    private serverLimitClient: ClientProxy,
    @Inject('DEAD_QUEUE_SERVICE') private deadQueueClient: ClientProxy,
  ) {}

  sendMessage(
    id: string,
    data: { [key: string]: string },
  ): QueueMessageResponseDto {
    try {
      this.errorClient.emit(id, data);
      this.serverLimitClient.emit(id, data);
      return { message: 'Message sent successfully' };
    } catch (error) {
      return { error: `Unexpected error: ${error}` };
    }
  }

  sendEmailErrorMessage(
    contactEmailErrorMessageDto: ContactEmailErrorMessageDto,
  ): QueueMessageResponseDto {
    try {
      this.errorClient.emit(
        'emailErrorQueueMessage',
        contactEmailErrorMessageDto,
      );
      return { message: 'Message sent successfully' };
    } catch (error) {
      return { error: `Unexpected error: ${error}` };
    }
  }

  sendEmailServerLimitMessage(
    contactEmailServerLimitMessageDto: ContactEmailServerLimitMessageDto,
  ): QueueMessageResponseDto {
    try {
      this.serverLimitClient.emit(
        'emailServerLimitQueueMessage',
        contactEmailServerLimitMessageDto,
      );
      return { message: 'Message sent successfully' };
    } catch (error) {
      return { error: `Unexpected error: ${error}` };
    }
  }

  sendMessageToDeadQueue(data: {
    [key: string]: string;
  }): QueueMessageResponseDto {
    try {
      this.deadQueueClient.emit('deadQueueMessage', data);
      return { message: 'Message sent successfully' };
    } catch (error) {
      return { error: `Unexpected error: ${error}` };
    }
  }
}
