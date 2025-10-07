import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Author } from 'src/authors/schemas/author.schema';

export type BookDocument = HydratedDocument<Book>;

@Schema()
export class Book {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  })
  author: Author;
  @Prop({
    required: true,
    index: true,
  })
  title: string;
  @Prop({
    required: true,
    index: true,
  })
  publicationYear: number;
  @Prop()
  fileName?: string;
}
export const BookSchema = SchemaFactory.createForClass(Book);
