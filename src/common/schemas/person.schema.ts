import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PersonDocument = HydratedDocument<Person>;

@Schema()
export class Person {
  @Prop({
    required: true,
    index: true,
  })
  firstName: string;
  @Prop({
    required: true,
    index: true,
  })
  lastName: string;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
