import React from 'react';
import { Drawer, List, ListItem, ListItemText, Box, Divider } from '@mui/material';
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
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                },
            }}
        >
            <Box>
                <List>
                    <ListItem button onClick={() => navigate('/dashboard')}>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/logs')}>
                        <ListItemText primary="Logs" />
                    </ListItem>
                </List>
            </Box>

            <Box>
                <Divider />
                <List>
                    <ListItem button onClick={handleLogout}>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
