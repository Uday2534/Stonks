import {
  Navigate,
} from 'react-router-dom';

import {
  useAuth,
} from '../context/AuthContext';

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({
  children,
}: Props) => {
  const { token } =
    useAuth();

  if (!token) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;