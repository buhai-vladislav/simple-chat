import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { UserDocument } from './User';
import { MessageDocument } from './Message';

@Schema({ timestamps: true, collection: 'rooms' })
export class Room {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  host: UserDocument;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  users: UserDocument[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Message' }] })
  messages: MessageDocument[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
export type RoomDocument = HydratedDocument<Room>;
