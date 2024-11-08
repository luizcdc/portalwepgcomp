import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class RabbitMQController {
  private readonly logger = new Logger(RabbitMQController.name);

  @MessagePattern('message')
  async message(@Payload() data, @Ctx() context: RmqContext) {
    try {
      this.logger.log(`Message received. data: ${JSON.stringify(data)}`);

      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();

      channel.ack(originalMsg);
      return data;
    } catch (error) {
      this.logger.error(`Message error: ${error}`);
    }
  }

  @MessagePattern('emailErrorQueueMessage')
  async emailErrorMessage(@Payload() data, @Ctx() context: RmqContext) {
    try {
      this.logger.log(
        `emailErrorMessage received. data: ${JSON.stringify(data)}`,
      );

      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();

      channel.ack(originalMsg);
      return data;
    } catch (error) {
      this.logger.error(`emailErrorMessage error: ${error}`);
    }
  }

  @MessagePattern('emailServerLimitQueueMessage')
  async emailServerLimitMessage(@Payload() data, @Ctx() context: RmqContext) {
    try {
      this.logger.log(
        `emailServerLimitMessage received. data: ${JSON.stringify(data)}`,
      );

      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();

      channel.ack(originalMsg);
      return data;
    } catch (error) {
      this.logger.error(`emailServerLimitMessage error: ${error}`);
    }
  }
}
