import { Module } from '@nestjs/common';
import { StudentService } from './student.service';

@Module({
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
