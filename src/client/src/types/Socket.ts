import { IMessage } from './Message';
import { IRoom } from './Room';
interface User {
  userId: string;
  socketId: string;
}

interface Message {
  userId: string;
  message: string;
  roomId: string;
}

interface CreateRoom {
  name: string;
  userId: string;
}

interface GetMessages {
  roomId: string;
}

interface JoinRoom {
  userId: string;
  roomId: string;
  socketId: string;
}

interface ServerToClientEvents {
  message: (e: IMessage) => void;
  rooms: (data: IRoom[]) => void;
}

interface ClientToServerEvents {
  message: (e: Message) => void;
  join_room: (e: JoinRoom, clb: (messages: IMessage[]) => void) => void;
  create_room: (e: CreateRoom) => void;
  rooms: () => IRoom[];
}

enum ClientEvents {
  message = 'message',
  join_room = 'join_room',
  create_room = 'create_room',
  rooms = 'rooms',
}

enum ServerEvents {
  message = 'message',
  rooms = 'rooms',
}

export type {
  ClientToServerEvents,
  ServerToClientEvents,
  User,
  Message,
  CreateRoom,
  GetMessages,
  JoinRoom,
};

export { ServerEvents, ClientEvents };
