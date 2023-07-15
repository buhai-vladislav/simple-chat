interface IResponse<T> {
  message: string;
  statusCode: number;
  data?: T;
  error?: string | object;
}

export type { IResponse };
