import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/roles/schemas/roles.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true })
  role: Role;
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  name: string;
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  email: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    default: true,
    required: true,
  })
  status: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
