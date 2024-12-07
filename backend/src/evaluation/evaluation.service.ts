import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from 'src/exceptions/app.exception';

@Injectable()
export class EvaluationService {
    constructor(private readonly prisma: PrismaService) {}

  async registerEvaluation(
    userId: string,
    presentationId: string,
    score: number,
    comments: string,
  ) {
    // Verificar se a apresentação existe
    const presentation = await this.prisma.presentation.findUnique({
      where: { id: presentationId },
    });
    if (!presentation) {
      throw new AppException("Apresentação não encontrada!", 404)//Error('Presentation not found');
    }

    // Verificar se o usuário existe
    const user = await this.prisma.userAccount.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new AppException("Usuário não encontrado!", 404)//Error('User not found');
    }
    console.log(typeof presentation.submissionId)
    // Criar avaliação
    const result = await this.prisma.evaluation.create({
      data: {
        userId,
        submissionId: presentation.submissionId,
        score,
        comments,
      },
    });
    return result
  }
}