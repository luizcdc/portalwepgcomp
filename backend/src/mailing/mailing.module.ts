import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { MailingController } from './mailing.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { queueConstants } from '../queue/constants';
import { EventEditionModule } from 'src/event-edition/event-edition.module';
import { CommitteeMemberModule } from 'src/committee-member/committee-member.module';

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
    EventEditionModule,
    CommitteeMemberModule,
  ],
  controllers: [MailingController],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
