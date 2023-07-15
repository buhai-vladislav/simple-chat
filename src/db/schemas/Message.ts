import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { UserDocument } from './User';
import { RoomDocument } from './Room';

@Schema({ timestamps: true, collection: 'messages' })
export class Message {
  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  author: UserDocument;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  room: RoomDocument;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
export type MessageDocument = HydratedDocument<Message>;
