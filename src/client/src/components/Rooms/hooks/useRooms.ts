import { FormElement } from '@nextui-org/react';
import { FormikValues, useFormik } from 'formik';
import { Socket, io } from 'socket.io-client';
import { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import { useAppSelector } from '../../../store/hooks/hooks';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  ClientEvents,
} from '../../../types/Socket';
import { validationSchema } from '../Rooms.helper';

import type { IFormProps } from '../Rooms.props';
import type { IRoom } from '../../../types/Room';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.REACT_APP_SOCKET_HOST ?? '',
  {
    autoConnect: false,
  },
);

type UseRooms = [
  IRoom[],
  string,
  ({ target }: ChangeEvent<FormElement>) => void,
  (to: string) => () => void,
  FormikValues,
];

const useRooms = (): UseRooms => {
  const { user } = useAppSelector((state) => state.user);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [roomName, setRoomName] = useState('');
  const [debouncedRoomName] = useDebounce(roomName, 700);
  const navigate = useNavigate();

  const handleNavigate = useCallback(
    (to: string) => () => {
      navigate(`/rooms/${to}`);
    },
    [],
  );
  const handleSearchChange = useCallback(
    ({ target }: ChangeEvent<FormElement>) => {
      setRoomName(target.value);
    },
    [],
  );
  const onSubmit = useCallback(({ roomName }: IFormProps) => {
    if (user) {
      socket.emit(ClientEvents.create_room, {
        name: roomName,
        userId: user?._id,
      });
      formik.resetForm();
    }
  }, []);

  const formik = useFormik<IFormProps>({
    initialValues: {
      roomName: '',
    },
    onSubmit,
    validationSchema,
  });

  useEffect(() => {
    socket.on(ClientEvents.rooms, (data: IRoom[]) => {
      setRooms(data);
    });
    socket.emitWithAck(ClientEvents.rooms).then((data) => {
      setRooms(data);
    });
    socket.connect();

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off(ClientEvents.rooms);
    };
  }, []);

  return [rooms, debouncedRoomName, handleSearchChange, handleNavigate, formik];
};

export { useRooms };
