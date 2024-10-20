import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { StudentModule } from 'src/student/student.module';
import { TeacherModule } from 'src/teacher/teacher.module';

@Module({
  imports: [StudentModule, TeacherModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
