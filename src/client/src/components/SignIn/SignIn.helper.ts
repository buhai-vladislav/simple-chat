import { object, string } from 'yup';

const validationSchema = object({
  email: string()
    .email("It's not a valid email.")
    .required('Email is required.'),
  password: string().required('Password is required.'),
});

export { validationSchema };
