import { Module } from '@nestjs/common';
import { QueueService as QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQController } from './rabbitMQ.controller';
import { queueConstants } from './constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EMAIL_ERROR_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.QUEUE_URL],
          queue: queueConstants.queues[0],
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'EMAIL_SERVER_LIMIT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.QUEUE_URL],
          queue: queueConstants.queues[1],
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'DEAD_QUEUE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.QUEUE_URL],
          queue: queueConstants.queues[2],
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [QueueController, RabbitMQController],
  providers: [QueueService],
})
export class QueueModule {}
