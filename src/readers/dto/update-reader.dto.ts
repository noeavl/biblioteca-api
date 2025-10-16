import { PartialType } from '@nestjs/mapped-types';
import { CreateReaderDto } from './create-reader.dto';

export class UpdateReaderDto extends PartialType(CreateReaderDto) {}
