import { IUser } from './User';

interface IMessage {
  text: string;
  author: IUser;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type { IMessage };
