import { Badge, Card, Input, Tooltip } from '@nextui-org/react';
import { RoomWrapper, SendButton } from './Room.presets';
import { useFormik } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';
import { object, string } from 'yup';
import { Socket, io } from 'socket.io-client';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  ClientEvents,
  ServerEvents,
} from '../../types/Socket';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks/hooks';
import { IFormProps } from './Room.props';
import { IMessage } from '../../types/Message';
import { SendIcom } from '../../icons';
import ScrollContainer from 'react-indiana-drag-scroll';
import { getFullDate } from '../../utils/utils';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.REACT_APP_SOCKET_HOST ?? '',
  {
    autoConnect: false,
  },
);

const validationSchema = object({
  message: string().required('Message is required.'),
});

export const Room = () => {
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

  return (
    <RoomWrapper>
      <div className="messages_wrapper">
        <ScrollContainer
          className="messages"
          hideScrollbars={false}
          innerRef={scrollRef}
        >
          {messages.map(({ author, text, createdAt, _id }) => (
            <div
              className={user?._id === author._id ? 'message right' : 'message'}
              key={_id}
            >
              <div className="top_wrapper">
                <span className="author">{author.name}</span>
                <Tooltip placement="top" content={getFullDate(createdAt).date}>
                  <span>{getFullDate(createdAt).time}</span>
                </Tooltip>
              </div>
              <span className="text">{text}</span>
            </div>
          ))}
        </ScrollContainer>
      </div>
      <form onSubmit={formik.handleSubmit} className="input-block">
        <Card className="input-card">
          <Input
            color="primary"
            status={!!formik.errors.message ? 'error' : 'default'}
            onChange={formik.handleChange}
            name="message"
            value={formik.values.message}
            width="700px"
            aria-label="Message"
            clearable
            contentRightStyling={false}
            placeholder="Type your message..."
            contentRight={
              <SendButton>
                <SendIcom />
              </SendButton>
            }
          />
        </Card>
      </form>
    </RoomWrapper>
  );
};
