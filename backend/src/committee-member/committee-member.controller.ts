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
  create(@Body() createCommitteeMemberDto: CreateCommitteeMemberDto) {
    return this.committeeMemberService.create(createCommitteeMemberDto);
  }

  @Get()
  findAll() {
    return this.committeeMemberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.committeeMemberService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommitteeMemberDto: UpdateCommitteeMemberDto,
  ) {
    return this.committeeMemberService.update(id, updateCommitteeMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.committeeMemberService.remove(id);
  }
}
