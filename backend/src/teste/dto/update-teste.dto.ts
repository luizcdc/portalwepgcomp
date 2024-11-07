import { PartialType } from '@nestjs/swagger';
import { CreateTesteDto } from './create-teste.dto';

export class UpdateTesteDto extends PartialType(CreateTesteDto) {}
