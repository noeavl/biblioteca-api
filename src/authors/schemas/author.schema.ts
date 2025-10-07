import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Book } from 'src/books/schemas/book.schema';
import { Person } from 'src/common/schemas/person.schema';

export type AuthorDocument = HydratedDocument<Author>;

@Schema()
export class Author {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
  })
  person: Person;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  })
  books?: Book[];
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
