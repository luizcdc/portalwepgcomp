import { Module } from '@nestjs/common';
import { AwardedDoctoralStudentsService } from './awarded-doctoral-students.service';
import { AwardedDoctoralStudentsController } from './awarded-doctoral-students.controller';

@Module({
  controllers: [AwardedDoctoralStudentsController],
  providers: [AwardedDoctoralStudentsService],
})
export class AwardedDoctoralStudentsModule {}
