import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Person } from 'src/common/schemas/person.schema';
import { User } from 'src/users/schemas/user.schema';

export type ReaderDocument = HydratedDocument<Reader>;

@Schema()
export class Reader {
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'User',
  })
  user: User;
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'Person',
  })
  person: Person;
  @Prop({
    default: false,
  })
  suscription: boolean;
}

export const ReaderSchema = SchemaFactory.createForClass(Reader);
