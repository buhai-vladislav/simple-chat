import { object, string } from 'yup';

const validationSchema = object({
  message: string().required('Message is required.'),
});

export { validationSchema };
