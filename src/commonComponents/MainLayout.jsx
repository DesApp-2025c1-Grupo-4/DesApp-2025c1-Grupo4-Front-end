import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {Box, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText,Divider, Tooltip, Toolbar} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LanguageIcon from '@mui/icons-material/LanguageOutlined';
import TruckIcon from '@mui/icons-material/LocalShippingOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlined';
import InventoryIcon from '@mui/icons-material/Inventory2Outlined';
import MapIcon from '@mui/icons-material/MapOutlined';
import ReportIcon from '@mui/icons-material/SignalCellularAltOutlined';
import { Header } from '../commonComponents/Header';

const drawerWidth = 200;

const menuItems = [
  { icon: <HomeIcon />, label: "Inicio", path: "/" },
  { icon: <LanguageIcon />, label: "Empresas", path: "/empresas" },
  { icon: <TruckIcon />, label: "Vehículos", path: "/vehiculos" },
  { icon: <PersonIcon />, label: "Choferes", path: "/choferes" },
  { icon: <InventoryIcon />, label: "Depósitos", path: "/depositos" },
  { icon: <MapIcon />, label: "Viajes", path: "/listado-viajes" },
  { icon: <ReportIcon />, label: "Reportes", path: "/reportes" }
];

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        PaperProps={{
          sx: {
            width: collapsed ? 72 : drawerWidth,
            overflowX: 'hidden',
            boxShadow: 3
          }
        }}
        open
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 64 }}>
          <IconButton onClick={() => setCollapsed(!collapsed)}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {menuItems.map(({ icon, label, path }) => (
            <Tooltip title={collapsed ? label : ''} placement="right" key={label}>
              <ListItemButton
                selected={location.pathname === path}
                onClick={() => navigate(path)}
                sx={{
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: 2,
                  py: 1.5
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2 }}>
                  {icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={label} />}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Drawer>
      {/* Contenido principal */}
      <Box sx={{ flexGrow: 1 }}>
        <Header />
        <Box component="main" sx={{ p: 1, mt: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
