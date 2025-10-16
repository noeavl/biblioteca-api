import { IsMongoId, IsString } from 'class-validator';

export class CreateCollectionBookDto {
  @IsString()
  @IsMongoId()
  book: string;

  @IsString()
  @IsMongoId()
  collection: string;
}
