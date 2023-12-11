import { Button, Input, Loading, Text } from '@nextui-org/react';

import { FormWrapper } from '../../shared/FormWrapper';
import { INPUT_WIDTH } from '../../utils/constants';
import { useSignIn } from './hooks/useSignIn';

export const SignIn = () => {
  const [formik] = useSignIn();

  return (
    <FormWrapper onSubmit={formik.handleSubmit}>
      <Text h3>Sign In</Text>
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
        status={!!formik.errors.password ? 'error' : 'default'}
        helperText={formik.errors.password}
        label="Password"
        onChange={formik.handleChange}
        name="password"
        value={formik.values.password}
        width={INPUT_WIDTH}
      />
      <Button type="submit">
        {formik.isSubmitting ? <Loading size="sm" /> : 'Sign In'}
      </Button>
    </FormWrapper>
  );
};
