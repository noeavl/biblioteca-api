import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Book } from 'src/books/schemas/book.schema';
import { Reader } from 'src/readers/schemas/reader.schema';

export type FavoriteDocumen = HydratedDocument<Favorite>;

@Schema()
export class Favorite {
  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  })
  books: Book[];
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reader',
  })
  reader: Reader;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
