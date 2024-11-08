import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { StudentModule } from './student/student.module';
import { ProfessorModule } from './professor/professor.module';
import { ConfigModule } from '@nestjs/config';
import { MailingModule } from './mailing/mailing.module';
import { QueueModule } from './queue/queue.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    StudentModule,
    ProfessorModule,
    ConfigModule.forRoot(),
    MailingModule,
    QueueModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
