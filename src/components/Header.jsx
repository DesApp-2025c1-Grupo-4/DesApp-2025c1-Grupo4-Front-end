import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import logo1 from '../assets/logo1.png';
import logo2 from '../assets/logo2.png';
import { current } from '@reduxjs/toolkit';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const titles = {
    '/': 'Logística Acme SRL',
    '/registro-viajes': 'Registro de Viajes',
    '/modificar-viaje': 'Modificar Viaje',
    '/segumiento': 'Seguimiento',
    '/listado-viajes': 'Listado de Viajes',
    '/empresa' : 'Empresa Transportista'
  };
  const isHomePage = location.pathname === '/';

  const scaleFactor = 1.3;
  const logoHeight = 40 * scaleFactor; 
  const appBarHeight = 56 * scaleFactor;

  const handleLogo1Click = () => {
    const currentPath = location.pathname;
    
    if (currentPath === '/registro-viajes' || current === '/empresa') {
      navigate('/');
    } else if (currentPath === '/modificar-viaje' || currentPath === '/segumiento' || currentPath === '/listado-viajes') {
      navigate('/registro-viajes');
    }
  };

  return isHomePage ? (
    <AppBar position="static" sx={{ height: `${appBarHeight}px` }}>
      <Toolbar sx={{ 
        justifyContent: 'center', 
        minHeight: `${appBarHeight}px !important`,
      }}>
        <Typography variant="h5" sx={{ fontSize: '1.5rem' }}>
          {titles[location.pathname] || 'Logística Acme SRL'}
        </Typography>
      </Toolbar>
    </AppBar>
  ) : (
    <AppBar position="static" sx={{ height: `${appBarHeight}px`,marginTop: '0', boxshadow: 'none' }}>
      <Toolbar sx={{ 
        justifyContent: 'space-between', 
        minHeight: `${appBarHeight}px !important`,
        px: 3,
        paddingTop: 0, 
        paddingBottom: 0, 
      }}>
        <IconButton 
          edge="start" 
          color="inherit" 
          onClick={handleLogo1Click}
          sx={{ 
            p: 1,
            '&:hover img': { 
              transform: 'scale(1.5)',
              transition: 'transform 0.3s ease',
            }
          }}
        >
          <img 
            src={logo1} 
            alt="Logo 1" 
            style={{ 
              height: `${logoHeight}px`,
              transition: 'transform 0.3s ease', 
            }}
          />
        </IconButton>
        
        <Typography variant="h5" sx={{ fontSize: '1.5rem' }}>
          {titles[location.pathname] || 'Logística Acme SRL'}
        </Typography>

        <IconButton 
          edge="end" 
          color="inherit" 
          onClick={() => navigate('/')}
          sx={{ 
            p: 1,
            '&:hover img': {
              transform: 'scale(1.5)',
              transition: 'transform 0.3s ease',
            }
          }}
        >
          <img 
            src={logo2} 
            alt="Logo 2" 
            style={{ 
              height: `${logoHeight}px`,
              transition: 'transform 0.3s ease',
            }}
          />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;