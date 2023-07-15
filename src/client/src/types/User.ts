import { IBase } from './Base';

interface IUser extends IBase {
  name: string;
  email: string;
}

export type { IUser };
