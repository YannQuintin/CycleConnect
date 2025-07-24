import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../../../hooks/useAuth';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <DirectionsBikeIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CycleConnect
        </Typography>
        
        <IconButton color="inherit" sx={{ mr: 2 }}>
          <NotificationsIcon />
        </IconButton>
        
        <Avatar sx={{ bgcolor: 'secondary.main' }}>
          {user?.profile?.firstName?.[0] || 'U'}
        </Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
