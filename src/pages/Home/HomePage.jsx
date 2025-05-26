import { Box, Stack, IconButton, Button} from "@mui/material";
import { useNavigate } from "react-router-dom";
import image from "../../assets/img/image.jpg";
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined';

export function HomePage(){

  const navigate = useNavigate();
  const items = [
    { icon: <LanguageOutlinedIcon/>, title: "Empresas Transportistas", path: "/empresas" },
    { icon: <LocalShippingOutlinedIcon/>, title: "Flota de Vehículos", path: "/vehiculos" },
    { icon: <PersonOutlinedIcon/>, title: "Choferes", path: "/choferes" },
    { icon: <Inventory2OutlinedIcon/>, title: "Red de Depósitos", path: "/depositos" },
    { icon: <MapOutlinedIcon/>, title: "Registro de Viajes", path: "/viajes" },
    { icon: <SignalCellularAltOutlinedIcon/>, title: "Reportes", path: "/reportes" }
  ];
  

  return <Box sx={{ width:"100%" }}> 
    <Box sx={{ mx:-4, mt:-1}}>
      <img src={image} alt="background" width= "100%" height="auto"/>
    </Box>
    <Stack direction="row" spacing={5} justifyContent={"space-between"} height={"auto"} pt={6} pb={4}> 
      {items.map((item, index) => (
        <Stack key={index} direction="column" justifyContent={"space-between"}>
          <Box sx={{display: 'flex', justifyContent: 'center', py: 2}}><IconButton disableRipple>{item.icon}</IconButton></Box>
          <Box sx={{display: 'flex', justifyContent: 'center', py: 2, typography: 'h3' }}>{item.title}</Box>
          <Box sx={{display: 'flex', justifyContent: 'center', py: 3, marginBottom: "0"}}><Button variant="contained" onClick={() => navigate(item.path)}>Ir</Button></Box>
        </Stack>
      ))}
    </Stack> 
  </Box>;
};