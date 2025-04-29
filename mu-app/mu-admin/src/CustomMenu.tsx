// src/CustomMenu.tsx
import { Menu, MenuItemLink } from 'react-admin';
import { useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';

const CustomMenu = () => {
  const location = useLocation();

  return (
    <Menu>
      <Typography variant="subtitle2" sx={{ margin: 1 }}>
        Processes
      </Typography>
      <MenuItemLink
        to="/activity-assignment"
        primaryText="Activity Assignment"
        leftIcon={<span>🧩</span>}
        selected={location.pathname === '/activity-assignment'}
      />
      
      <Typography variant="subtitle2" sx={{ margin: 1, marginTop: 2 }}>
        Resources
      </Typography>
      <MenuItemLink
        to="/characters"
        primaryText="Characters"
        leftIcon={<span>👤</span>}
        selected={location.pathname === '/characters'}
      />
      <MenuItemLink
        to="/logs"
        primaryText="Logs"
        leftIcon={<span>📄</span>}
        selected={location.pathname === '/logs'}
      />
    </Menu>
  );
};

export default CustomMenu;