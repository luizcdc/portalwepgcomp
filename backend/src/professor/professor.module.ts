import { Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';

@Module({
  providers: [ProfessorService],
  exports: [ProfessorService],
})
export class ProfessorModule {}
