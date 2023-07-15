import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { Room } from 'src/db/schemas/Room';
import { User } from 'src/db/schemas/User';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  CreateRoom,
  ClientEvents,
  ServerEvents,
  JoinRoom,
  Message,
} from '../types/Socket';
import { Message as MessageModel } from 'src/db/schemas/Message';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger;
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(MessageModel.name)
    private readonly messageModel: Model<MessageModel>,
  ) {
    this.logger = new Logger(ChatGateway.name);
    this.logger.log('Gateway connected');
  }

  @WebSocketServer() server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();

  @SubscribeMessage(ClientEvents.create_room)
  public async createRoom(@MessageBody() payload: CreateRoom) {
    const { name, userId } = payload;
    const user = await this.userModel.findOne({ _id: userId });

    if (!user) {
      throw new Error('User not found');
    }

    await this.roomModel.create({
      name,
      host: user,
      users: [user],
    });
    this.server.emit(
      ServerEvents.rooms,
      await this.roomModel.find(
        {},
        {},
        { populate: [{ path: 'users' }, { path: 'host' }] },
      ),
    );
  }

  @SubscribeMessage(ClientEvents.join_room)
  public async joinToRoom(@MessageBody() payload: JoinRoom) {
    const { userId, roomId, socketId } = payload;

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }
    const room = await this.roomModel.findById(
      roomId,
      {},
      {
        populate: [
          { path: 'users' },
          { path: 'host' },
          { path: 'messages', populate: [{ path: 'author' }] },
        ],
      },
    );

    if (!room) {
      throw new Error('Room not found');
    }

    if (!room.users.find(({ _id }) => _id.toString() === userId)) {
      room.users.push(user);
      await room.save();
    }

    this.server.in(socketId).socketsJoin(roomId);

    return room.messages;
  }

  @SubscribeMessage(ClientEvents.rooms)
  public async getRooms() {
    return await this.roomModel.find(
      {},
      {},
      { populate: [{ path: 'users' }, { path: 'host' }] },
    );
  }

  @SubscribeMessage(ClientEvents.message)
  public async message(@MessageBody() payload: Message) {
    const { roomId, userId, message } = payload;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const room = await this.roomModel.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    const createMessage = await this.messageModel.create({
      text: message,
      author: user,
    });
    room.messages.push(createMessage);
    const [popMessage] = await Promise.all([
      createMessage.populate([{ path: 'author' }]),
      room.save(),
    ]);

    this.server.to(roomId).emit(ServerEvents.message, popMessage);

    return createMessage;
  }

  async handleConnection(socket: Socket): Promise<void> {
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }
}
