import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ConnectBroker from './pages/ConnectBroker';
import ProtectedRoute from './routes/ProtectedRoute';
import ZerodhaCallback from './pages/ZerodhaCallback';

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/connect-broker"
        element={
          <ProtectedRoute>
            <ConnectBroker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/zerodha/callback"
        element={<ZerodhaCallback />}
      />
    </Routes>
  );
};

export default App;