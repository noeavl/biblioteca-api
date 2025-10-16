import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Book } from 'src/books/schemas/book.schema';
import { Reader } from 'src/readers/schemas/reader.schema';

export type CollectionDocument = HydratedDocument<Collection>;

@Schema()
export class Collection {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reader',
  })
  reader: Reader;
  @Prop({
    required: true,
    index: true,
  })
  name: string;
  @Prop({
    required: false,
  })
  @Prop({
    required: false,
  })
  description: string;
  @Prop({
    required: false,
    default: 'private',
  })
  visibility?: string;
  @Prop({
    required: false,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  })
  books?: Book[];
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
