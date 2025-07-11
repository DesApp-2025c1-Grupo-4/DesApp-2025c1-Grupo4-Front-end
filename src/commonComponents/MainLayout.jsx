import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Divider, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Home, LanguageOutlined as Language, LocalShippingOutlined as Truck, 
  PersonOutlined as Person, Inventory2Outlined as Inventory, 
  MapOutlined as Map, SignalCellularAltOutlined as Report } from '@mui/icons-material';
import { Header } from '../commonComponents/Header';

const drawerWidth = 200;
const menuItems = [
  { icon: <Home />, label: "Inicio", path: "/" },
  { icon: <Language />, label: "Empresas", path: "/empresas" },
  { icon: <Truck />, label: "Vehículos", path: "/vehiculos" },
  { icon: <Person />, label: "Choferes", path: "/choferes" },
  { icon: <Inventory />, label: "Depósitos", path: "/depositos" },
  { icon: <Map />, label: "Viajes", path: "/listado-viajes" },
  { icon: <Report />, label: "Reportes", path: "/reportes" }
];

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <Box sx={{ display: 'flex' }}>
      {!isHomePage && (
        <Drawer variant="permanent" PaperProps={{ sx: { width: collapsed ? 72 : drawerWidth, overflowX: 'hidden', boxShadow: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 64 }}>
            <IconButton onClick={() => setCollapsed(!collapsed)}><MenuIcon /></IconButton>
          </Box>
          <Divider />
          <List>
            {menuItems.map(({ icon, label, path }) => (
              <Tooltip title={collapsed ? label : ''} placement="right" key={label}>
                <ListItemButton selected={location.pathname === path} onClick={() => navigate(path)}
                  sx={{ justifyContent: collapsed ? 'center' : 'flex-start', px: 2, py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2 }}>{icon}</ListItemIcon>
                  {!collapsed && <ListItemText primary={label} />}
                </ListItemButton>
              </Tooltip>
            ))}
          </List>
        </Drawer>
      )}

      <Box sx={{ flexGrow: 1 }}>
        <Header />
        <Box component="main" sx={{ p: 1, mt: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default MainLayout;