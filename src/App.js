
import React, { useState, useMemo } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Box, CssBaseline, IconButton, Tooltip } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

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

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const lightTheme = useMemo(() => createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#fff',
        paper: '#f9f9f9',
      },
    },
  }), []);

  const darkTheme = useMemo(() => createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    },
  }), []);

  const theme = darkMode ? darkTheme : lightTheme;

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      localStorage.setItem('darkMode', JSON.stringify(!prev));
      return !prev;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" height="100vh">
        {token && !isAuthPage && <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}

        <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
          {/* Dark mode toggle button top-right for demo */}
          {token && !isAuthPage && (
            <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
              <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                <IconButton onClick={toggleDarkMode} color="inherit">
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
            </Box>
          )}

          <Routes>
            <Route path="/" element={<Navigate to="/logs" replace />} />
            <Route path="/dashboard" element={<Analytics />} />
            <Route path="/logs" element={<Logs />} />
            {/* <Route path="/settings" element={<Settings />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;

