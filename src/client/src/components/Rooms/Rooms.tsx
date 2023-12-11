import { Button, Card, Input } from '@nextui-org/react';
import ScrollContainer from 'react-indiana-drag-scroll';

import { FormWrapper } from '../../shared/FormWrapper';
import { INPUT_WIDTH } from '../../utils/constants';
import { RoomsWrapper } from './Rooms.presets';
import { useRooms } from './hooks/useRooms';

export const Rooms = () => {
  const [rooms, debouncedRoomName, handleSearchChange, handleNavigate, formik] =
    useRooms();

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
