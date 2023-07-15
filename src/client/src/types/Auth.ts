import { IUser } from './User';

interface ISignInResponse {
  user: IUser;
  accessToken: string;
}

interface ISignUp {
  email: string;
  password: string;
  name: string;
}

interface ISignIn {
  email: string;
  password: string;
}

export type { ISignInResponse, ISignUp, ISignIn };
