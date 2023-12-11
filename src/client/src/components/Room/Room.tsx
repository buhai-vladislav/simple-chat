import { Card, Input, Tooltip } from '@nextui-org/react';
import ScrollContainer from 'react-indiana-drag-scroll';

import { RoomWrapper, SendButton } from './Room.presets';
import { SendIcom } from '../../icons';
import { getFullDate } from '../../utils/utils';
import { useRoom } from './hooks/useRoom';

export const Room = () => {
  const [messages, user, scrollRef, formik] = useRoom();

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
