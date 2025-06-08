import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const titles = {
    '/': 'Logística Acme SRL',
    '/registro-viajes': 'Registro de Viajes',
    '/modificar-viaje': 'Modificar Viaje',
    '/seguimiento': 'Seguimiento',
    '/listado-viajes': 'Listado de Viajes',
    '/empresa': 'Empresa Transportista',
    '/vehiculos': 'Flota de Vehículos',
    '/chofer': 'Choferes',
    '/depositos': 'Red de Depósitos',
    '/reportes': 'Reportes',
  };



  const isHomePage = location.pathname === '/';

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
    <AppBar position="static" >
      <Toolbar sx={{ justifyContent: isHomePage ? 'center' : 'space-between' }}>
        {!isHomePage && (
          <IconButton variant= 'header' edge="start" onClick={handleLogo1Click}>
            <HomeOutlinedIcon/>
          </IconButton>
        )}

        <Typography variant="h5">
          {titles[location.pathname] || 'Logística Acme SRL'}
        </Typography>

        {!isHomePage && (
          <IconButton variant= 'header' edge="end" onClick={() => navigate('/')}>
            <HomeOutlinedIcon/>
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};