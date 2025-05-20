import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#f9f9f9',
          borderRight: '1px solid #ddd',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box>
          <Typography variant="h6" sx={{ p: 2, fontWeight: 600 }}>
            API Logger
          </Typography>
          <Divider />
          <List>
            <ListItemButton onClick={() => navigate('/dashboard')}>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/logs')}>
              <ListItemText primary="Logs" />
            </ListItemButton>
          </List>
        </Box>

        <Box mt="auto">
          <Divider />
          <List>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
