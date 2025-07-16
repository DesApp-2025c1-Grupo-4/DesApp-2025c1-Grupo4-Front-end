import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from "../../commonComponents/Footer";
import { Box, Grid, Card, CardContent, Typography, IconButton, Button, CircularProgress} from "@mui/material";
import homeBackground from "../../assets/img/homeBackground.jpg";
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined';

const Home = () => {
  const navigate = useNavigate();
  const [loadingIndex, setLoadingIndex] = useState(null);

  const menuItems = [
    { icon: <LanguageOutlinedIcon variant='biggerIcons'/>, title: "Empresas Transportistas", path: "/empresas" },
    { icon: <LocalShippingOutlinedIcon variant='biggerIcons'/>, title: "Flota de Vehículos", path: "/vehiculos" },
    { icon: <PersonOutlinedIcon variant='biggerIcons'/>, title: "Choferes", path: "/choferes" },
    { icon: <Inventory2OutlinedIcon variant='biggerIcons'/>, title: "Red de Depósitos", path: "/depositos" },
    { icon: <MapOutlinedIcon variant='biggerIcons'/>, title: "Registro de Viajes", path: "/listado-viajes" },
    { icon: <SignalCellularAltOutlinedIcon variant='biggerIcons'/>, title: "Reportes", path: "/reportes" }
  ];
  
  const handleButtonClick = (path, index) => {
    setLoadingIndex(index);
    setTimeout(() => {
      navigate(path);
      setLoadingIndex(null);
    }, 200);
  };

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '90vh', // Ocupa al menos el 100% del viewport height
      '&.MuiBox-root': theme => theme.components.MuiBox.styleOverrides.root.pageContainer  
    }}>
      <Box sx={{ 
        flex: 1, // Esto hace que el contenido ocupe todo el espacio disponible
        '&.MuiBox-root': theme => theme.components.MuiBox.styleOverrides.root.pageContent 
      }}>
        <Box sx={{ 
          width: '100%', 
          maxWidth: '1400px', 
          mx: 'auto', 
          p: 4,
          flex: 1 // Asegura que el contenido interno también ocupe todo el espacio
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <img src={homeBackground} alt="imagen de fondo" style={{ width: '800%', maxWidth: '3000px', height: 'auto' }}/>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {menuItems.map((item, index) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={index} sx={{ display: 'flex' }}>
                <Card sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <CardContent sx={{ textAlign: 'center', p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box alt={item.title} sx={{display: 'flex', justifyContent: 'center', py: 2}}><IconButton variant='home' disableRipple>{item.icon}</IconButton></Box>
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
      </Box>
      <Footer sx={{ mt: 'auto' }} /> {/* Esto empujará el footer hacia abajo */}
    </Box>
  );
};

export default Home;