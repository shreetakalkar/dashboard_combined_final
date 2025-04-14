import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material';
import PlansIcon from '@mui/icons-material/WorkspacePremium';
import RequestPageOutlinedIcon from '@mui/icons-material/RequestPageOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { SidebarContext } from './SidebarContext'; 
import Home from '../../assets/home 1.png';
import Inventory from '../../assets/inventory.png';
import Contact from '../../assets/contact.png';
import Order from '../../assets/order.png';
import Settings from '../../assets/settings.png';

const Sidebar = () => {
  const { setSelectedItem } = useContext(SidebarContext); 
  const navigate = useNavigate();

  const handleItemClick = async (item) => {
    if (item === 'Log Out') {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.warn("No auth token found. Redirecting to login.");
          navigate('/login', { replace: true });
          return;
        }

        const response = await fetch('http://localhost:5000/users/signout', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        console.log('Logout response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Logout failed');
        }

        localStorage.removeItem('authToken');
        localStorage.removeItem('syncComplete');
        sessionStorage.clear();

        window.dispatchEvent(new Event('storage'));

        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 300); 

      } catch (error) {
        console.error('Error during signout:', error);

        // Handle session expiration
        if (error.message.includes("Session Expired")) {
          console.warn("Session expired. Clearing storage and redirecting.");
          localStorage.clear();
          sessionStorage.clear();
          navigate('/login', { replace: true });
        }
      }
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        '& .MuiDrawer-paper': {
          width: '200px',
          backgroundColor: '#3E3D45',
          color: '#fff',
          height: '100vh',
          display: 'flex',
          overflow: 'hidden',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <Box>
        {/* Sidebar Header */}
        <Typography
          sx={{
            color: '#fff',
            textAlign: 'center',
            padding: '20px 0',
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            fontSize: '18px', 
          }}
        >
          Bargenix
        </Typography>
        <Divider sx={{ backgroundColor: '#444' }} />

        {/* Sidebar Menu List */}
        <List
          sx={{
            paddingLeft: '16px', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', 
            width: '100%',
          }}
        >
          {/* Home */}
          <ListItem
            button
            component={Link}
            to="/"
            onClick={() => handleItemClick('Home')}
            sx={{
              '&:hover': {
                backgroundColor: '#1976d2',
              },
              marginLeft: '-16px', 
              marginRight: '-16px', 
              paddingLeft: '32px', 
              paddingRight: '16px',
            }}
          >
            <img
              src={Home}
              alt="icon"
              style={{ color: '#fff', width: '24px', height: '24px' }}
            />
            <ListItemText
              primary="Home"
              sx={{
                color: '#fff',
                fontFamily: ' sans-serif',
                fontSize: '14px', 
                marginLeft: '8px', 
              }}
            />
          </ListItem>

          {/* Inventory */}
          <ListItem
            button
            component={Link}
            to="/inventory"
            onClick={() => handleItemClick('Inventory')}
            sx={{
              '&:hover': {
                backgroundColor: '#1976d2',
              },
              marginLeft: '-16px', 
              marginRight: '-16px', 
              paddingLeft: '32px', 
              paddingRight: '16px',
            }}
          >
            <img
              src={Inventory}
              alt="icon"
              style={{ color: '#fff', width: '24px', height: '24px' }}
            />
            <ListItemText
              primary="Inventory"
              sx={{
                color: '#fff',
                fontFamily: ' sans-serif',
                fontSize: '14px',
                marginLeft: '8px', 
              }}
            />
          </ListItem>

          {/* Order */}
          <ListItem
            button
            component={Link}
            to="/order"
            onClick={() => handleItemClick('Order')}
            sx={{
              '&:hover': {
                backgroundColor: '#1976d2',
              },
              marginLeft: '-16px', 
              marginRight: '-16px', 
              paddingLeft: '32px', 
              paddingRight: '16px',
            }}
          >
            <img
              src={Order}
              alt="icon"
              style={{ color: '#fff', width: '24px', height: '24px' }}
            />
            <ListItemText
              primary="Order"
              sx={{
                color: '#fff',
                fontFamily: ' sans-serif',
                fontSize: '14px',
                marginLeft: '8px', 
              }}
            />
          </ListItem>

          {/* Settings */}
          <ListItem
            button
            component={Link}
            to="/settings"
            onClick={() => handleItemClick('Settings')}
            sx={{
              '&:hover': {
                backgroundColor: '#1976d2',
              },
              marginLeft: '-16px', 
              marginRight: '-16px', 
              paddingLeft: '30px', 
              paddingRight: '16px',
            }}
          >
            <img
              src={Settings}
              alt="icon"
              style={{ color: '#fff', width: '24px', height: '24px' }}
            />
            <ListItemText
              primary="Settings"
              sx={{
                color: '#fff',
                fontFamily: ' sans-serif',
                fontSize: '14px',
                marginLeft: '8px', 
              }}
            />
          </ListItem>

          {/* Request */}
          <ListItem
            button
            component={Link}
            to="/Request"
            onClick={() => handleItemClick('Request')}
            sx={{
              '&:hover': {
                backgroundColor: '#1976d2',
              },
              marginLeft: '-16px', 
              marginRight: '-16px', 
              paddingLeft: '28px', 
              paddingRight: '14px',
            }}
          >
            <ListItemIcon sx={{ minWidth: '30px' }}>
              <RequestPageOutlinedIcon sx={{ color: '#fff', width: '28px', height: '28px' }} />
            </ListItemIcon>
            <ListItemText
              primary="Request"
              sx={{
                color: '#fff',
                fontFamily: ' sans-serif',
                fontSize: '14px',
                marginLeft: '4px', 
              }}
            />
          </ListItem>

          {/* Plans */}
          <ListItem
            button
            component={Link}
            to="/plans"
            onClick={() => handleItemClick('Plans')}
            sx={{
              '&:hover': {
                backgroundColor: '#1976d2',
              },
              marginLeft: '-16px', 
              marginRight: '-16px', 
              paddingLeft: '28px',
              paddingRight: '16px',
            }}
          >
            <ListItemIcon sx={{ minWidth: '30px' }}>
              <PlansIcon sx={{ color: '#fff', width: '28px', height: '28px' }} />
            </ListItemIcon>
            <ListItemText
              primary="Plans"
              sx={{
                color: '#fff',
                fontFamily: ' sans-serif',
                fontSize: '14px',
                marginLeft: '4px', 
              }}
            />
          </ListItem>

          {/* Contact */}
          <ListItem
            button
            component={Link}
            to="/contact"
            onClick={() => handleItemClick('Contact')}
            sx={{
              '&:hover': {
                backgroundColor: '#1976d2',
              },
              marginLeft: '-16px', 
              marginRight: '-16px', 
              paddingLeft: '32px', 
              paddingRight: '16px',
            }}
          >
            <img
              src={Contact}
              alt="icon"
              style={{ color: '#fff', width: '24px', height: '24px' }}
            />
            <ListItemText
              primary="Contact"
              sx={{
                color: '#fff',
                fontFamily: ' sans-serif',
                fontSize: '14px',
                marginLeft: '8px', 
              }}
            />
          </ListItem>
          <Divider sx={{ backgroundColor: '#444' }} />
        </List>
      </Box>

      {/* Footer Section */}
      <Box>
        <List
          sx={{
            paddingLeft: '16px', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%',
          }}>
          <ListItem
            button
            onClick={() => handleItemClick('Log Out')}
            sx={{
              '&:hover': {
                backgroundColor: '#1976d2',
              },
              marginLeft: '-16px', 
              marginRight: '-16px', 
              paddingLeft: '32px', 
              paddingRight: '16px',
            }}
          >
            <ListItemIcon sx={{ minWidth: '30px' }}>
              <ExitToAppIcon sx={{ color: '#fff', width: '24px', height: '24px' }} />
            </ListItemIcon>
            <ListItemText
              primary="Log Out"
              sx={{
                color: '#fff',
                fontFamily: ' sans-serif',
                fontSize: '14px',
              }}
            />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;