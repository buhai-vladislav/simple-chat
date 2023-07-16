import { styled } from '@nextui-org/react';

export const RoomsWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: '20px',
  '.form': {
    height: 'fit-content',
  },
  '.scroll-wrapper': {
    marginTop: '20px',
    maxHeight: '400px',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    '.room': {
      width: '350px',
      button: {
        width: '100%',
      },
    },
  },
  '.rooms': {
    height: 'fit-content',
    padding: '20px',
  },
});
