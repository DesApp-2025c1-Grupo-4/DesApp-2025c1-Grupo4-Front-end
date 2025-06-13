import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const SideNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <LanguageOutlinedIcon />, title: "Empresas", path: "/empresas" },
    { icon: <LocalShippingOutlinedIcon />, title: "Vehículos", path: "/vehiculos" },
    // ... otros items
  ];

  return (
    <Box sx={{
      width: 240,
      height: '100vh',
      position: 'fixed',
      borderRight: '1px solid #ddd',
      bgcolor: 'background.paper'
    }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};