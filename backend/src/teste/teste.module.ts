import { Module } from '@nestjs/common';
import { TesteService } from './teste.service';
import { TesteController } from './teste.controller';

@Module({
  controllers: [TesteController],
  providers: [TesteService],
})
export class TesteModule {}
