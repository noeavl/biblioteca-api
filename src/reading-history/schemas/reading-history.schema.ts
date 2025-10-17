import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Book } from 'src/books/schemas/book.schema';
import { Reader } from 'src/readers/schemas/reader.schema';

export type ReadingHistoryDocument = HydratedDocument<ReadingHistory>;

@Schema()
export class ReadingHistory {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reader',
  })
  reader: Reader;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  })
  books: Book[];
}

export const ReadingHistorySchema =
  SchemaFactory.createForClass(ReadingHistory);
