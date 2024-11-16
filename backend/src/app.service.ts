import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private executionDate = new Date;
  getServerStatus(): string {
    return `Servidor rodando em ${this.executionDate}`;
  }
}
