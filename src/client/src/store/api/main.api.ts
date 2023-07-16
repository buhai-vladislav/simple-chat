import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { IResponse } from '../../types/Response';
import type { IUser } from '../../types/User';
import type { ISignIn, ISignInResponse, ISignUp } from '../../types/Auth';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_HOST,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const mainApi = createApi({
  reducerPath: 'main',
  baseQuery: baseQuery,
  endpoints: (build) => ({
    signup: build.mutation<IResponse<IUser>, ISignUp>({
      query: (body) => ({
        url: 'auth/signup',
        method: 'POST',
        body,
      }),
    }),
    signin: build.mutation<IResponse<ISignInResponse>, ISignIn>({
      query: ({ email, password }) => ({
        url: 'auth/signin',
        method: 'POST',
        body: {
          email,
          password,
        },
      }),
    }),
    getSelf: build.query<IResponse<IUser>, void>({
      query: () => ({
        url: 'auth/self',
        method: 'GET',
      }),
    }),
  }),
});

export const { useSignupMutation, useSigninMutation, useLazyGetSelfQuery } =
  mainApi;
