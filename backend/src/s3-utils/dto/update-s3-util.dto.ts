import { PartialType } from '@nestjs/swagger';
import { CreateS3UtilDto } from './create-s3-util.dto';

export class UpdateS3UtilDto extends PartialType(CreateS3UtilDto) {}
