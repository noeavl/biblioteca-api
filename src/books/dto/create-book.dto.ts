import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsMongoId()
  @ApiProperty()
  authorId: string;
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(new Date().getFullYear() + 5)
  publicationYear: number;
  @ApiProperty()
  @IsString()
  @IsMongoId()
  @IsOptional()
  categoryId: string;
}
