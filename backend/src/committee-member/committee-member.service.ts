import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommitteeMemberDto } from './dto/create-committee-member.dto';
import { ResponseCommitteeMemberDto } from './dto/response-committee-member.dto';
import { UpdateCommitteeMemberDto } from './dto/update-committee-member.dto';

@Injectable()
export class CommitteeMemberService {
  constructor(private readonly prismaClient: PrismaService) {}

  async create(createCommitteeMemberDto: CreateCommitteeMemberDto) {
    await this.validateEventEditionAndUser(
      createCommitteeMemberDto.eventEditionId,
      createCommitteeMemberDto.userId,
    );

    const created = await this.prismaClient.committeeMember.create({
      data: createCommitteeMemberDto,
    });
    if (created == null) {
      throw new BadRequestException(
        'Não foi possível criar o membro da comissão',
      );
    } else {
      return new ResponseCommitteeMemberDto(created);
    }
  }

  async findAll() {
    const found = await this.prismaClient.committeeMember.findMany();
    return found.map(
      (committeeMember) => new ResponseCommitteeMemberDto(committeeMember),
    );
  }

  async findOne(id: string) {
    const committeeMember = await this.prismaClient.committeeMember.findUnique({
      where: { id },
    });

    if (!committeeMember) {
      throw new NotFoundException('Membro da comissão não encontrado');
    }

    return new ResponseCommitteeMemberDto(committeeMember);
  }

  async update(id: string, updateCommitteeMemberDto: UpdateCommitteeMemberDto) {
    await this.findOne(id);
    const result = await this.prismaClient.committeeMember.update({
      where: { id },
      data: updateCommitteeMemberDto,
    });
    return new ResponseCommitteeMemberDto(result);
  }

  async remove(id: string) {
    await this.findOne(id);
    const result = await this.prismaClient.committeeMember.delete({
      where: { id },
    });
    return new ResponseCommitteeMemberDto(result);
  }

  private async validateEventEditionAndUser(
    eventEditionId: string,
    userId: string,
  ) {
    const eventEdition = await this.prismaClient.eventEdition.findUnique({
      where: { id: eventEditionId },
    });

    if (!eventEdition) {
      throw new BadRequestException(
        `Edição do evento com ID ${eventEditionId} não encontrada`,
      );
    }

    const user = await this.prismaClient.userAccount.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException(`Usuário com ID ${userId} não encontrado`);
    }
  }
}
