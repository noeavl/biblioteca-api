import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsString()
  @IsOptional()
  fileName?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;
}
