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
    '/segumiento': 'Seguimiento',
    '/listado-viajes': 'Listado de Viajes',
    '/empresa': 'Empresa Transportista',
  };
  const isHomePage = location.pathname === '/';

  const scaleFactor = 1.3;
  const logoHeight = 40 * scaleFactor;

  const handleLogo1Click = () => {
    const currentPath = location.pathname;
    if (currentPath === '/registro-viajes' || 
      currentPath === '/empresa'
    ) {
      navigate('/');
    } else if (
      currentPath === '/modificar-viaje' ||
      currentPath === '/segumiento' ||
      currentPath === '/listado-viajes'
    ) {
      navigate('/registro-viajes');
    } 
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: isHomePage ? 'center' : 'space-between' }}>
        {!isHomePage && (
          <IconButton edge="start" onClick={handleLogo1Click}>
            <img
              src={logo1}
              alt="Logo 1"
              style={{ height: `${logoHeight}px` }}
            />
          </IconButton>
        )}

        <Typography variant="h5">
          {titles[location.pathname] || 'Logística Acme SRL'}
        </Typography>

        {!isHomePage && (
          <IconButton edge="end" onClick={() => navigate('/')}>
            <img
              src={logo2}
              alt="Logo 2"
              style={{ height: `${logoHeight}px` }}
            />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;