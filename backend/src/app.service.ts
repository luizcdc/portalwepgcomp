import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private dataExecucao = new Date;
  getServerStatus(): string {
    return `Servidor rodando em ${this.dataExecucao}`;
  }
}
