import { Box } from "@mui/material";
import { IconButton } from '@mui/material';
import { grey } from "@mui/material/colors";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined';

export function NavBar() {

  const [title, setTitle] = useState([])
  const [logo1, setLogo1] = useState([])
  const [path1, setPath1] = useState([])
  const [logo2, setLogo2] = useState(<IconButton><HomeOutlinedIcon/></IconButton>)
  const [path2, setPath2] = useState('/')

  const location = useLocation();
   useEffect(() => {
    switch (location.pathname) {
      case '/':
        setTitle('Logística Acme SRL');
        setLogo1();
        setPath1();
        setLogo2();
        setPath2();
        break;
      case '/empresas':
        setTitle('Empresas transportistas');
        setLogo1(<IconButton><LanguageOutlinedIcon/></IconButton>);
        setPath1('/empresas');
        setLogo2(<IconButton><HomeOutlinedIcon/></IconButton>);
        setPath2('/');
        break;
      case '/vehiculos':
        setTitle('Flota de vehículos');
        setLogo1(<IconButton><LocalShippingOutlinedIcon style={{ fontSize: 45  }}/></IconButton>);
        setPath1('/vehiculos');
        setLogo2(<IconButton><HomeOutlinedIcon/></IconButton>);
        setPath2('/');
        break;
      case '/choferes':
        setTitle('Choferes');
        setLogo1(<IconButton><PersonOutlinedIcon/></IconButton>);
        setPath1('/choferes');
        setLogo2(<IconButton><HomeOutlinedIcon/></IconButton>);
        setPath2('/');
        break;
      case '/depositos':
        setTitle('Red de depósitos');
        setLogo1(<IconButton><Inventory2OutlinedIcon/></IconButton>);
        setPath1('/depositos');
        setLogo2(<IconButton><HomeOutlinedIcon/></IconButton>);
        setPath2('/');
        break;
      case '/viajes':
        setTitle('Viajes');
        setLogo1(<IconButton><MapOutlinedIcon/></IconButton>);
        setPath1('/viajes');
        setLogo2(<IconButton><HomeOutlinedIcon/></IconButton>);
        setPath2('/');
        break;
      case '/reportes':
        setTitle('Reportes');
        setLogo1(<IconButton><SignalCellularAltOutlinedIcon/></IconButton>);
        setPath1('/reportes');
        setLogo2(<IconButton><HomeOutlinedIcon/></IconButton>);
        setPath2('/');
        break;
    }
  }, [location.key]);

  function PageTitle(){
    return <Box sx={{ typography: 'topMenu'}} >
      {title}
    </Box>;
  }

  function LeftOption() {
    const navigate = useNavigate();
    return <Box onClick={() => navigate(path1)}>{logo1}</Box>;
  }

  function RightOption() {
    const navigate = useNavigate();
    return <Box onClick={() => navigate(path2)}>{logo2}</Box>;
  }

  return <Box sx={{ display: 'flex', flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '5rem', backgroundColor: grey[50], py: 4, px: 7 }}>
    <LeftOption/>
    <PageTitle/>
    <RightOption/>

  </Box>;
}