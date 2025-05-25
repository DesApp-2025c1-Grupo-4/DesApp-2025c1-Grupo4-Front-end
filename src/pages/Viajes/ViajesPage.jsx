import { Box, Stack, IconButton, Button} from "@mui/material";
import { useNavigate } from 'react-router-dom';

export function ViajesPage(){

  const navigate = useNavigate();

  return <Stack sx={{ width:"100%", direction:"row"}}> 
    <Box sx={{display: 'flex', justifyContent: 'center', py: 2 }}>
      <Button variant="contained" onClick={() => navigate('/registrar-viaje')}>Registrar Viaje</Button>
    </Box>
    <Box sx={{display: 'flex', justifyContent: 'center', py: 2}}>
      <Button variant="contained" onClick={() => navigate('/modificar-viaje')}>Modificar Viaje</Button>
    </Box>
    <Box sx={{display: 'flex', justifyContent: 'center', py: 2}}>
      <Button variant="contained" onClick={() => navigate('/seguimiento')}>Seguimiento</Button>
    </Box>
    <Box sx={{display: 'flex', justifyContent: 'center', py: 2 }}>
      <Button variant="contained" onClick={() => navigate('/listado-viajes')}>Listado de viajes</Button>
    </Box> 
  </Stack>
};
