import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Divider,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ darkMode, toggleDarkMode }) => {
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
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
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
          <Box sx={{ px: 2, mt: 2 }}>
            <FormControlLabel
              control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
              label="Dark Mode"
            />
          </Box>
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
