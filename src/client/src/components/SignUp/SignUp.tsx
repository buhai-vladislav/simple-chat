import { Button, Input, Text } from '@nextui-org/react';
import { FormWrapper } from '../../shared/FormWrapper';
import { useCallback } from 'react';
import { IFormProps } from './SignUp.props';
import { useFormik } from 'formik';
import { object, ref, string } from 'yup';
import { useSignupMutation } from '../../store/api/main.api';
import { IMutation } from '../../types/RTK';
import { IResponse } from '../../types/Response';
import { IUser } from '../../types/User';
import { useErrorToast } from '../../hooks/useErrorToast';
import { HttpStatus } from '../../types/HttpStatus';
import { ToastOptions } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { INPUT_WIDTH } from '../../utils/constants';

const validationSchema = object({
  name: string().required('Fullname is required'),
  email: string().email('Invalid email format.').required('Email is required'),
  password: string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: string()
    .oneOf([ref('password')], 'Passwords do not match')
    .required('Confirm password is required')
    .min(6, 'Confirm password must be at least 6 characters'),
});

export const SignUp = () => {
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

  return (
    <>
      <FormWrapper onSubmit={formik.handleSubmit}>
        <Text h3>Sign Up</Text>
        <Input
          color="primary"
          rounded
          status={!!formik.errors.name ? 'error' : 'default'}
          helperText={formik.errors.name}
          label="Fullname"
          onChange={formik.handleChange}
          name="name"
          value={formik.values.name}
          width={INPUT_WIDTH}
        />
        <Input
          color="primary"
          rounded
          status={!!formik.errors.email ? 'error' : 'default'}
          helperText={formik.errors.email}
          label="Email"
          onChange={formik.handleChange}
          name="email"
          value={formik.values.email}
          width={INPUT_WIDTH}
        />
        <Input.Password
          color="primary"
          rounded
          label="Password"
          status={!!formik.errors.password ? 'error' : 'default'}
          helperText={formik.errors.password}
          onChange={formik.handleChange}
          name="password"
          value={formik.values.password}
          width={INPUT_WIDTH}
        />
        <Input.Password
          color="primary"
          rounded
          label="Confirm password"
          status={!!formik.errors.confirmPassword ? 'error' : 'default'}
          helperText={formik.errors.confirmPassword}
          onChange={formik.handleChange}
          name="confirmPassword"
          value={formik.values.confirmPassword}
          width={INPUT_WIDTH}
        />
        <Button type="submit" disabled={!formik.isValid}>
          Next
        </Button>
      </FormWrapper>
    </>
  );
};
