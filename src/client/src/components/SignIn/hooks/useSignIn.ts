import { FormikValues, useFormik } from 'formik';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useErrorToast } from '../../../hooks/useErrorToast';
import { useSigninMutation } from '../../../store/api/main.api';
import { useAppDispatch } from '../../../store/hooks/hooks';
import { setUser } from '../../../store/reducers/user';
import { HttpStatus } from '../../../types/HttpStatus';
import { validationSchema } from '../SignIn.helper';

import type { IMutation } from '../../../types/RTK';
import type { IResponse } from '../../../types/Response';
import type { ISignInResponse } from '../../../types/Auth';
import type { ISignInFormProps } from '../SignIn.props';

const useSignIn = (): [FormikValues] => {
  const [signin, { error }] = useSigninMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onSubmit = useCallback(
    async ({ email, password }: ISignInFormProps) => {
      const response: IMutation<IResponse<ISignInResponse>> = await signin({
        email,
        password,
      });

      if (response?.data?.data?.user) {
        dispatch(setUser(response.data.data?.user));

        localStorage.setItem('accessToken', response.data.data?.accessToken);
        navigate('/');
      }
    },
    [],
  );

  const formik = useFormik<ISignInFormProps>({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit,
    validationSchema,
    validateOnChange: false,
  });

  useErrorToast(
    error,
    [{ status: HttpStatus.BAD_REQUEST }, { status: HttpStatus.UNAUTHORIZED }],
    { position: 'bottom-center', type: 'error' },
  );

  return [formik];
};

export { useSignIn };
