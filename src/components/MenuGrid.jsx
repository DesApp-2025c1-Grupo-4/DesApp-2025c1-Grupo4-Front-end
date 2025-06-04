import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo3 from '../assets/logo3.png';
import icon1 from '../assets/icon1.png';
import icon2 from '../assets/icon2.png';
import icon3 from '../assets/icon3.png';
import icon4 from '../assets/icon4.png';
import icon5 from '../assets/icon5.png';
import icon6 from '../assets/icon6.png';

const MenuGrid = () => {
  const navigate = useNavigate();
  const [loadingIndex, setLoadingIndex] = useState(null);

  const menuItems = [
    { icon: icon1, title: "Empresas Transportistas", path: "/empresas" },
    { icon: icon2, title: "Flota de Vehículos", path: "/flota" },
    { icon: icon3, title: "Choferes", path: "/choferes" },
    { icon: icon4, title: "Red de Depósitos", path: "/depositos" },
    { icon: icon5, title: "Registros de Viajes", path: "/registro-viajes" },
    { icon: icon6, title: "Reportes", path: "/reportes" },
  ];

  const handleButtonClick = (path, index) => {
    setLoadingIndex(index);
    setTimeout(() => {
      navigate(path);
      setLoadingIndex(null);
    }, 200);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1400px', mx: 'auto', p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
        <img src={logo3} alt="Logotipo principal" style={{ width: '800%', maxWidth: '3000px', height: 'auto' }}/>
      </Box>
      <Grid container spacing={4} justifyContent="center">
        {menuItems.map((item, index) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={index} sx={{ display: 'flex' }}>
            <Card sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <CardContent sx={{ textAlign: 'center', p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box component="img" src={item.icon} alt={item.title} sx={{ width: 60, height: 60, mb: 1, mx: 'auto' }} />
                <Typography variant="subtitle1" gutterBottom sx={{ flex: 1 }}>{item.title}</Typography>
                <Button 
                  variant="contained"
                  onClick={() => handleButtonClick(item.path, index)}
                  disabled={loadingIndex === index}
                  color={loadingIndex === index ? 'secondary' : 'primary'}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'secondary.main',
                      color: 'secondary.contrastText',
                    },
                  }}
                >
                  {loadingIndex === index ? (
                    <>
                      <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
                      Redirigiendo...
                    </>
                  ) : (
                    'Acceder'
                  )}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MenuGrid;