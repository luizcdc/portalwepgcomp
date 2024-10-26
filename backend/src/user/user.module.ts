import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { StudentModule } from 'src/student/student.module';
import { ProfessorModule } from 'src/professor/professor.module';

@Module({
  imports: [StudentModule, ProfessorModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
