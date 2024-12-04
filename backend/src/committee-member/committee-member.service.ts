import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommitteeMemberDto } from './dto/create-committee-member.dto';
import { ResponseCommitteeMemberDto } from './dto/response-committee-member.dto';
import { UpdateCommitteeMemberDto } from './dto/update-committee-member.dto';
import { UserLevel, CommitteeLevel } from '@prisma/client';

@Injectable()
export class CommitteeMemberService {
  constructor(private readonly prismaClient: PrismaService) {}

  async create(createCommitteeMemberDto: CreateCommitteeMemberDto) {
    await this.validateEventEditionAndUser(
      createCommitteeMemberDto.eventEditionId,
      createCommitteeMemberDto.userId,
    );

    return await this.prismaClient.$transaction(async (prisma) => {
      if (createCommitteeMemberDto.level === CommitteeLevel.Coordinator) {
        const currentCoordinator = await prisma.committeeMember.findFirst({
          where: {
            eventEditionId: createCommitteeMemberDto.eventEditionId,
            level: CommitteeLevel.Coordinator,
          },
        });

        if (currentCoordinator) {
          await prisma.committeeMember.delete({
            where: { id: currentCoordinator.id },
          });
        }
      }
      let created = null;
      try {
        created = await prisma.committeeMember.create({
          data: createCommitteeMemberDto,
        });
      } catch (error) {
        return new BadRequestException(
          'Não foi possível criar o membro da comissão: ' + error,
        );
      }
      if (created) {
        await this.promoteUser(
          createCommitteeMemberDto.userId,
          createCommitteeMemberDto.level,
        );
      }

      if (!created) {
        throw new BadRequestException(
          'Não foi possível criar o membro da comissão',
        );
      }

      return new ResponseCommitteeMemberDto(created);
    });
  }

  private async promoteUser(userId: string, committeeLevel: CommitteeLevel) {
    await this.prismaClient.userAccount.update({
      where: { id: userId },
      data: {
        level:
          committeeLevel === CommitteeLevel.Coordinator
            ? UserLevel.Superadmin
            : UserLevel.Admin,
      },
    });
  }

  private async demoteUser(userId: string, committeeLevel: CommitteeLevel) {
    await this.prismaClient.userAccount.update({
      where: { id: userId },
      data: {
        level:
          committeeLevel === CommitteeLevel.Coordinator
            ? UserLevel.Superadmin
            : UserLevel.Default,
      },
    });
  }

  async findAll(eventEditionId: string) {
    // To create the ResponseCommitteeMemberDto, we need to also return the user name
    const found = await this.prismaClient.committeeMember.findMany({
      where: { eventEditionId },
      include: { user: true },
    });
    if (found.length === 0) {
      // Check whether the event edition exists
      const eventEdition = await this.prismaClient.eventEdition.findUnique({
        where: { id: eventEditionId },
      });
      if (!eventEdition) {
        throw new NotFoundException(
          `Edição do evento com ID ${eventEditionId} não encontrada`,
        );
      }
    }
    // destructure the returned object, remove user from it, but use it to create the userName field
    return found.map(
      ({ user, ...committeeMember }) =>
        new ResponseCommitteeMemberDto({
          ...committeeMember,
          userName: user.name,
        }),
    );
  }

  async findOne(id: string) {
    const committeeMember = await this.prismaClient.committeeMember.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!committeeMember) {
      throw new NotFoundException('Membro da comissão não encontrado');
    }

    const { user, ...responseCommitteeMember } = committeeMember;
    return new ResponseCommitteeMemberDto({
      ...responseCommitteeMember,
      userName: user.name,
    });
  }

  async update(
    id: string | null,
    updateCommitteeMemberDto: UpdateCommitteeMemberDto,
    userId?: string,
    eventEditionId?: string,
  ) {
    let committeeMember;

    if (id) {
      committeeMember = await this.findOne(id);
    } else if (userId && eventEditionId) {
      // no need to call this.validateEventEditionAndUser because
      // we're already querying for it anyway
      committeeMember = await this.getCommitteeMember(userId, eventEditionId);

      if (!committeeMember) {
        throw new NotFoundException('Membro da comissão não encontrado');
      }
    } else {
      throw new BadRequestException(
        'ID ou userId e eventEditionId são necessários',
      );
    }

    const result = await this.prismaClient.committeeMember.update({
      where: { id: committeeMember.id },
      data: updateCommitteeMemberDto,
      include: { user: true },
    });

    if (updateCommitteeMemberDto.level) {
      await this.promoteUser(result.userId, result.level);
    }
    const { user, ...resultDto } = result;
    return new ResponseCommitteeMemberDto({
      ...resultDto,
      userName: user.name,
    });
  }

  async remove(id: string, userId?: string, eventEditionId?: string) {
    let committeeMember;
    if (id) {
      committeeMember = await this.prismaClient.committeeMember.findFirst({
        where: {
          id,
        },
      });
      if (!committeeMember) {
        throw new NotFoundException('Membro da comissão não encontrado');
      }
    } else if (userId && eventEditionId) {
      // no need to call this.validateEventEditionAndUser because
      // we're already querying for it anyway
      committeeMember = await this.getCommitteeMember(userId, eventEditionId);
      id = committeeMember.id;
    }
    await this.demoteUser(
      committeeMember.userId,
      committeeMember.committeeLevel,
    );
    const result = await this.prismaClient.committeeMember.delete({
      where: { id },
    });
    return new ResponseCommitteeMemberDto(result);
  }

  private async getCommitteeMember(userId: string, eventEditionId: string) {
    const committeeMember = await this.prismaClient.committeeMember.findFirst({
      where: {
        userId,
        eventEditionId,
      },
    });

    if (!committeeMember) {
      throw new NotFoundException('Membro da comissão não encontrado');
    }

    return committeeMember;
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
