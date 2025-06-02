import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button } from '@mui/material';
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
  const menuItems = [
    { icon: icon1, title: "Empresas Transportistas", path: "/empresas" },
    { icon: icon2, title: "Flota de Vehículos", path: "/flota" },
    { icon: icon3, title: "Choferes", path: "/choferes" },
    { icon: icon4, title: "Red de Depósitos", path: "/depositos" },
    { icon: icon5, title: "Registros de Viajes", path: "/registro-viajes" },
    { icon: icon6, title: "Reportes", path: "/reportes" },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: '1400px', mx: 'auto', p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
        <img src={logo3} alt="Logotipo principal" style={{ width: '800%', maxWidth: '3000px', height: 'auto' }}/>
      </Box>
      <Grid container spacing={4} justifyContent="center">
        {menuItems.map((item, index) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Box component="img" src={item.icon} alt={item.title} sx={{ width: 60, height: 60, mb: 1 }}/>
                <Typography variant="subtitle1" gutterBottom>{item.title}</Typography>
                <Button variant="contained" onClick={() => navigate(item.path)} fullWidth>Acceder</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MenuGrid;