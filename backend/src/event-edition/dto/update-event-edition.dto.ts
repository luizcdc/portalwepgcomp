import { PartialType } from '@nestjs/mapped-types';
import { CreateEventEditionDto, CreateFromEventEditionFormDto } from './create-event-edition.dto';

export class UpdateEventEditionDto extends PartialType(CreateEventEditionDto) {
    
}

export class UpdateFromEventEditionFormDto extends PartialType(CreateFromEventEditionFormDto) {

}