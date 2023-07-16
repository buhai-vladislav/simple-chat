import { Avatar, Button, Navbar, Popover, Text } from '@nextui-org/react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks/hooks';
import { useCallback } from 'react';
import { resetUser } from '../../store/reducers/user';

export const Header = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const logoutHandler = useCallback(async () => {
    localStorage.clear();
    dispatch(resetUser());
    navigate('/signin');
  }, []);

  return (
    <Navbar isBordered variant="sticky">
      <Navbar.Brand>
        <Logo />
        <Text b color="inherit" hideIn="xs">
          <Link to="/">SChat</Link>
        </Text>
      </Navbar.Brand>
      <Navbar.Content>
        {!user ? (
          <>
            <Button auto light>
              <Link to="signin">Sign In</Link>
            </Button>
            <Button auto flat>
              <Link to="signup">Sign Up</Link>
            </Button>
          </>
        ) : (
          <>
            <Link to="rooms">
              <Text h5 css={{ marginBottom: '0' }}>
                Rooms
              </Text>
            </Link>
            <Popover placement="left">
              <Popover.Trigger>
                <Avatar
                  text={user.name}
                  squared
                  bordered
                  css={{ cursor: 'pointer' }}
                />
              </Popover.Trigger>
              <Popover.Content>
                <Button size="sm" onPress={logoutHandler}>
                  Logout
                </Button>
              </Popover.Content>
            </Popover>
          </>
        )}
      </Navbar.Content>
    </Navbar>
  );
};
