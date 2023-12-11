import { object, string } from 'yup';

const validationSchema = object({
  roomName: string().required('Room name is required'),
});

export { validationSchema };
