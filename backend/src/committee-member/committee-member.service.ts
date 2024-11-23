import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommitteeMemberDto } from './dto/create-committee-member.dto';
import { UpdateCommitteeMemberDto } from './dto/update-committee-member.dto';

@Injectable()
export class CommitteeMemberService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommitteeMemberDto: CreateCommitteeMemberDto) {
    await this.validateEventEditionAndUser(
      createCommitteeMemberDto.eventEditionId,
      createCommitteeMemberDto.userId,
    );

    return this.prisma.committeeMember.create({
      data: createCommitteeMemberDto,
    });
  }

  async findAll() {
    return this.prisma.committeeMember.findMany();
  }

  async findOne(id: string) {
    const committeeMember = await this.prisma.committeeMember.findUnique({
      where: { id },
    });

    if (!committeeMember) {
      throw new NotFoundException('Membro da comissão não encontrado');
    }

    return committeeMember;
  }

  async update(id: string, updateCommitteeMemberDto: UpdateCommitteeMemberDto) {
    await this.findOne(id);

    return this.prisma.committeeMember.update({
      where: { id },
      data: updateCommitteeMemberDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.committeeMember.delete({
      where: { id },
    });
  }

  private async validateEventEditionAndUser(
    eventEditionId: string,
    userId: string,
  ) {
    const eventEdition = await this.prisma.eventEdition.findUnique({
      where: { id: eventEditionId },
    });

    if (!eventEdition) {
      throw new BadRequestException(
        `Edição do evento com ID ${eventEditionId} não encontrada`,
      );
    }

    const user = await this.prisma.userAccount.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException(`Usuário com ID ${userId} não encontrado`);
    }
  }
}
