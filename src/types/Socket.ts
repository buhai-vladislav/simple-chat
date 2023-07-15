import { Room, RoomDocument } from '../db/schemas/Room';
import { MessageDocument } from '../db/schemas/Message';

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
  message: (e: Message) => void;
  rooms: (data: Room[]) => void;
}

interface ClientToServerEvents {
  message: (e: Message) => void;
  join_room: (e: JoinRoom, clb: (messages: MessageDocument[]) => void) => void;
  create_room: (e: CreateRoom) => void;
  rooms: () => RoomDocument[];
}

enum ClientEvents {
  message = 'message',
  join_room = 'join_room',
  get_messages = 'get_messages',
  create_room = 'create_room',
  rooms = 'rooms',
}

enum ServerEvents {
  message = 'message',
  rooms = 'rooms',
}

export {
  ClientToServerEvents,
  ServerToClientEvents,
  User,
  Message,
  CreateRoom,
  GetMessages,
  JoinRoom,
  ServerEvents,
  ClientEvents,
};
