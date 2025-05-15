import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Analytics from './pages/Analytics';

const App = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <Box display="flex">
      {token && !isAuthPage && <Sidebar />}

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route path="/dashboard" element={<Analytics />} />
          <Route path="/logs" element={<Logs />} />
          {/* <Route path="/settings" element={<Settings />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
