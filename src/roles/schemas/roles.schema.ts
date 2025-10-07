import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema()
export class Role {
  @Prop({
    required: true,
    index: true,
    unique: true,
  })
  name: string;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  })
  users: User[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
