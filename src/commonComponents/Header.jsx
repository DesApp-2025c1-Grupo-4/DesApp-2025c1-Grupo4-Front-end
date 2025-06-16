import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { ROUTE_CONFIG } from '../config/routesConfig';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const currentRoute = useMemo(() => {
    return ROUTE_CONFIG[location.pathname];
  }, [location.pathname]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flex: 1 }} />
        <Typography variant="topMenu" sx={{ flex: 1, textAlign: 'center' }}>
          {currentRoute.title}
        </Typography>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          {!isHomePage && (
            <IconButton variant='header' onClick={() => navigate('/')}>
              <HomeOutlinedIcon variant='biggerIcons'/>
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};