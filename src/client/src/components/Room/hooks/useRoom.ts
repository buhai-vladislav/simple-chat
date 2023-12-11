import { FormikValues, useFormik } from 'formik';
import { useRef, useState, useCallback, useEffect, RefObject } from 'react';
import { Socket, io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

import { useAppSelector } from '../../../store/hooks/hooks';
import {
  ClientEvents,
  ClientToServerEvents,
  ServerEvents,
  ServerToClientEvents,
} from '../../../types/Socket';
import { validationSchema } from '../Room.helper';

import type { IMessage } from '../../../types/Message';
import type { IFormProps } from '../Room.props';
import type { IUser } from '../../../types/User';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.REACT_APP_SOCKET_HOST ?? '',
  {
    autoConnect: false,
  },
);

const useRoom = (): [
  IMessage[],
  IUser | undefined,
  RefObject<HTMLElement>,
  FormikValues,
] => {
  const { roomId } = useParams();
  const scrollRef = useRef<HTMLElement>(null);
  const { user } = useAppSelector((state) => state.user);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const onSubmit = useCallback(
    ({ message }: IFormProps) => {
      if (roomId && user && socket) {
        socket.emit(ClientEvents.message, {
          roomId,
          userId: user._id,
          message,
        });
        formik.resetForm();
      }
    },
    [roomId, user, socket],
  );

  const formik = useFormik<IFormProps>({
    initialValues: {
      message: '',
    },
    onSubmit,
    validationSchema,
  });

  const scrollToBottom = () => {
    const lastChildElement = scrollRef.current?.lastElementChild;
    lastChildElement?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (roomId && user) {
      socket.on('connect', () => {
        socket
          .emitWithAck(ClientEvents.join_room, {
            roomId,
            socketId: socket.id,
            userId: user._id,
          })
          .then((messages: IMessage[]) => {
            setMessages(messages);
          });
      });

      socket.on(ServerEvents.message, (message: IMessage) => {
        setMessages((messages) => {
          if (
            !messages.find(
              (msg) => msg._id.toString() === message._id.toString(),
            )
          ) {
            return [...messages, message];
          }
          return messages;
        });
      });

      socket.connect();

      return () => {
        socket.disconnect();
        socket.off('connect');
        socket.off('disconnect');
      };
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return [messages, user, scrollRef, formik];
};

export { useRoom };
