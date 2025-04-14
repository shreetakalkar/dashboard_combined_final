import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: { xs: 2, md: 0 }, 
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#000000',
            fontFamily: 'Helvetica',
            fontSize: { xs: '18px', md: '20px' },
          }}
        >
          NEY<span style={{ color: '#4F46BA' }}>X</span>
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: { xs: 'wrap', md: 'nowrap' }, 
            justifyContent: { xs: 'center', md: 'flex-end' }, 
            gap: 2, 
          }}
        >
          {['About us', 'Product', 'Contact', 'Watch Demo'].map((text) => (
            <Button
              key={text}
              color="inherit"
              sx={{
                fontSize: { xs: '12px', md: '14px' }, 
                fontWeight: 'bold',
                textTransform: 'none',
              }}
            >
              {text}
            </Button>
          ))}
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#4F46BA',
              fontSize: { xs: '12px', md: '14px' }, 
              textTransform: 'none',
            }}
          >
            Start Free
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
