import { io, Socket } from 'socket.io-client';
import {
  ClientEvents,
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../types/Socket';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { FormWrapper } from '../../shared/FormWrapper';
import { useFormik } from 'formik';
import { Button, Card, FormElement, Input } from '@nextui-org/react';
import { object, string } from 'yup';
import { INPUT_WIDTH } from '../../utils/constants';
import { useAppSelector } from '../../store/hooks/hooks';
import { RoomsWrapper } from './Rooms.presets';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import type { IFormProps } from './Rooms.props';
import type { IRoom } from '../../types/Room';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.REACT_APP_SOCKET_HOST ?? '',
  {
    autoConnect: false,
  },
);

const validationSchema = object({
  roomName: string().required('Room name is required'),
});

export const Rooms = () => {
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

  return (
    <RoomsWrapper>
      <FormWrapper onSubmit={formik.handleSubmit} className="form">
        <Input
          color="primary"
          rounded
          status={!!formik.errors.roomName ? 'error' : 'default'}
          helperText={formik.errors.roomName}
          label="Room name"
          onChange={formik.handleChange}
          name="roomName"
          value={formik.values.roomName}
          width={INPUT_WIDTH}
        />
        <Button type="submit" disabled={!formik.dirty}>
          Create room
        </Button>
      </FormWrapper>
      <Card className="rooms">
        <Input
          placeholder="Search by room name"
          onChange={handleSearchChange}
        />
        <ScrollContainer
          horizontal={false}
          vertical
          className="scroll-wrapper"
          hideScrollbars={false}
        >
          {rooms
            .filter(
              debouncedRoomName
                ? ({ name }) => name.includes(debouncedRoomName)
                : Boolean,
            )
            .map((room) => (
              <div className="room">
                <Button
                  color="gradient"
                  type="button"
                  ghost
                  key={room._id}
                  onPress={handleNavigate(room._id)}
                >
                  {room.name}
                </Button>
              </div>
            ))}
        </ScrollContainer>
      </Card>
    </RoomsWrapper>
  );
};
