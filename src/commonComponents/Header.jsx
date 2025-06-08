import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { ROUTE_CONFIG } from '../config/routesConfig';

export function Header() {

  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/' 

  const currentRoute = useMemo(() => {
    return ROUTE_CONFIG[location.pathname] 
  }, [location.pathname]);

  return (
    <AppBar position="static" >
      <Toolbar sx={{ justifyContent: isHomePage ? 'center' : 'space-between' }}>
        {!isHomePage && (
          <IconButton variant= 'header' edge="start" onClick={ () => navigate(currentRoute.returnPath)}>
            {currentRoute.logo}
          </IconButton>
        )}

        <Typography variant="topMenu">
          {currentRoute.title}
        </Typography>

        {!isHomePage && (
          <IconButton variant= 'header' edge="end" onClick={() => navigate('/')}>
            <HomeOutlinedIcon variant='biggerIcons'/>
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};