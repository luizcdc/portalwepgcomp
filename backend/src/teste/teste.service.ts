import { Injectable } from '@nestjs/common';
import { CreateTesteDto } from './dto/create-teste.dto';
import { UpdateTesteDto } from './dto/update-teste.dto';

@Injectable()
export class TesteService {
  create(createTesteDto: CreateTesteDto) {
    return 'This action adds a new teste';
  }

  findAll() {
    return `This action returns all teste`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teste`;
  }

  update(id: number, updateTesteDto: UpdateTesteDto) {
    return `This action updates a #${id} teste`;
  }

  remove(id: number) {
    return `This action removes a #${id} teste`;
  }
}
