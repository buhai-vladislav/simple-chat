import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../db/schemas/Message';
import { Room, RoomSchema } from '../db/schemas/Room';
import { User, UserSchema } from '../db/schemas/User';
import { ChatGateway } from '../controllers/ChatGataway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Room.name, schema: RoomSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  providers: [ChatGateway],
})
export class ChatModule {}
