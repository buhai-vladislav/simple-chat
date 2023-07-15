import { IUser } from './User';

interface IRoom {
  _id: string;
  name: string;
  host: IUser;
  users: IUser[];
  messages: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type { IRoom };
