import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { SidebarContext } from '../Sidebar/SidebarContext'; 

const Header = () => {
  const { selectedItem } = useContext(SidebarContext); 

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#F5F6FA',
        color: '#333',
        fontFamily: 'Roboto, sans-serif',
        fontSize: '14px',
        zIndex: 1200,
        boxShadow: 'none',
        marginLeft: '200px',
        width: 'calc(100% - 200px)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton>
            <HomeIcon />
          </IconButton>
          <Typography variant="p4" sx={{ color: '#6C6C6E', marginTop: '6px' }}>
            {selectedItem} 
          </Typography>
        </Box>

        <Box>
          <IconButton>
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;





