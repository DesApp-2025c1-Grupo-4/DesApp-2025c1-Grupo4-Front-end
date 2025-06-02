import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import logo1 from '../assets/logo1.png';
import logo2 from '../assets/logo2.png';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const titles = {
    '/': 'Logística Acme SRL',
    '/registro-viajes': 'Registro de Viajes',
    '/modificar-viaje': 'Modificar Viaje',
  };
  const isHomePage = location.pathname === '/';

  return isHomePage ? (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography variant="h6">{titles[location.pathname] || 'Logística Acme SRL'}</Typography>
      </Toolbar>
    </AppBar>
  ) : (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        <IconButton edge="start" color="inherit" onClick={() => navigate('/listado-viajes')}>
          <img src={logo1} alt="Logo 1" style={{ height: '40px' }}/>
        </IconButton>
        <Typography variant="h6">{titles[location.pathname] || 'Logística Acme SRL'}</Typography>
        <IconButton edge="end" color="inherit" onClick={() => navigate('/')}>
          <img src={logo2} alt="Logo 2" style={{ height: '40px' }}/>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;