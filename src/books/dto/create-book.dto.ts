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
  authorId: string;
  @IsString()
  title: string;
  @IsNumber()
  @Min(1)
  @Max(new Date().getFullYear() + 5)
  publicationYear: number;
  @IsString()
  @IsMongoId()
  @IsOptional()
  categoryId: string;
}
