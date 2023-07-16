import { styled } from '@nextui-org/react';

export const RoomWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  '.messages_wrapper': {
    display: 'flex',
    flexDirection: 'column',
    height: '70vh',
    justifyContent: 'flex-end',
  },
  '.messages': {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    maxHeight: '70vh',
    width: '100%',
    alignItems: 'flex-start',
    flexDirection: 'column',
    '.message': {
      padding: '8px',
      borderRadius: '5px',
      height: 'fit-content',
      boxShadow: '$sm',
      width: '320px',
      display: 'flex',
      flexDirection: 'column',
      '.text': {
        wordWrap: 'break-word',
      },
      '.nextui-tooltip-button': {
        span: {
          textAlign: 'right',
          width: '100%',
        },
      },
      '.top_wrapper': {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        span: {
          fontSize: '11px',
          fontWeight: 'bold',
        },
      },
    },
    '.right': {
      alignSelf: 'flex-end',
    },
  },
  '.input-card': {
    display: 'flex',
    flexDirection: 'row',
    padding: '10px',
    gap: '10px',
  },
});

export const SendButton = styled('button', {
  // reset button styles
  background: 'transparent',
  border: 'none',
  padding: 0,
  // styles
  width: '24px',
  margin: '0 10px',
  dflex: 'center',
  bg: '$primary',
  borderRadius: '$rounded',
  cursor: 'pointer',
  transition: 'opacity 0.25s ease 0s, transform 0.25s ease 0s',
  svg: {
    size: '100%',
    padding: '4px',
    transition: 'transform 0.25s ease 0s, opacity 200ms ease-in-out 50ms',
    boxShadow: '0 5px 20px -5px rgba(0, 0, 0, 0.1)',
  },
  '&:hover': {
    opacity: 0.8,
  },
  '&:active': {
    transform: 'scale(0.9)',
    svg: {
      transform: 'translate(24px, -24px)',
      opacity: 0,
    },
  },
});
