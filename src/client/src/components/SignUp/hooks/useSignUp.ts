import { FormikValues, useFormik } from 'formik';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastOptions } from 'react-toastify';

import { useErrorToast } from '../../../hooks/useErrorToast';
import { useSignupMutation } from '../../../store/api/main.api';
import { HttpStatus } from '../../../types/HttpStatus';
import { validationSchema } from '../Signup.helper';

import type { IMutation } from '../../../types/RTK';
import type { IResponse } from '../../../types/Response';
import type { IUser } from '../../../types/User';
import type { IFormProps } from '../SignUp.props';

const useSignUp = (): [FormikValues] => {
  const [signup, { error }] = useSignupMutation();
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async ({ email, name, password }: IFormProps) => {
      const response: IMutation<IResponse<IUser>> = await signup({
        email,
        password,
        name,
      });

      if (response.data) {
        navigate('/signin');
      }
    },
    [],
  );

  const formik = useFormik<IFormProps>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit,
    validationSchema,
  });

  const toastOptions: ToastOptions = {
    position: 'bottom-center',
    type: 'error',
  };

  useErrorToast(
    error,
    [{ status: HttpStatus.INTERNAL_SERVER_ERROR }],
    toastOptions,
  );

  return [formik];
};

export { useSignUp };
