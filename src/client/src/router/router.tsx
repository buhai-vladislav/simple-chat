import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import { SignUp } from '../components/SignUp';
import { SignIn } from '../components/SignIn';
import { ProtectedRoute } from '../shared/ProtectedRoute';
import { Rooms } from '../components/Rooms';
import { Room } from '../components/Room';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <h2>Welcome to SChat!</h2>,
      },
      {
        path: 'signin',
        element: <SignIn />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'rooms',
        element: (
          <ProtectedRoute>
            <Rooms />
          </ProtectedRoute>
        ),
      },
      {
        path: 'rooms/:roomId',
        element: (
          <ProtectedRoute>
            <Room />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export { router };
