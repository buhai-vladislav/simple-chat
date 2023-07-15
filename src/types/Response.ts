import { HttpStatus } from '@nestjs/common';
import { User } from './User';

export class AffectedResult {
  isAffected: boolean;
}

export class SignInResult {
  user: User;
  accessToken: string;
}

export class ResponseBody<T> {
  message: string;
  statusCode: HttpStatus;
  data?: T;
  error?: any;
}
