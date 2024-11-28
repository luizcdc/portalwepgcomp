import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommitteeMemberService } from './committee-member.service';
import { CreateCommitteeMemberDto } from './dto/create-committee-member.dto';
import { UpdateCommitteeMemberDto } from './dto/update-committee-member.dto';

@Controller('committee-member')
export class CommitteeMemberController {
  constructor(
    private readonly committeeMemberService: CommitteeMemberService,
  ) {}

  @Post()
  async create(@Body() createCommitteeMemberDto: CreateCommitteeMemberDto) {
    return await this.committeeMemberService.create(createCommitteeMemberDto);
  }

  @Get()
  async findAll() {
    return await this.committeeMemberService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.committeeMemberService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommitteeMemberDto: UpdateCommitteeMemberDto,
  ) {
    return await this.committeeMemberService.update(
      id,
      updateCommitteeMemberDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.committeeMemberService.remove(id);
  }
}
