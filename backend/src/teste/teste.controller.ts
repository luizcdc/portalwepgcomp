import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TesteService } from './teste.service';
import { CreateTesteDto } from './dto/create-teste.dto';
import { UpdateTesteDto } from './dto/update-teste.dto';

@Controller('teste')
export class TesteController {
  constructor(private readonly testeService: TesteService) {}

  @Post()
  create(@Body() createTesteDto: CreateTesteDto) {
    return this.testeService.create(createTesteDto);
  }

  @Get()
  findAll() {
    return this.testeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTesteDto: UpdateTesteDto) {
    return this.testeService.update(+id, updateTesteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testeService.remove(+id);
  }
}
