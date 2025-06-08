import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined';
import acmeLogoDef from "../assets/img/acmeLogoDef.png";

export const ROUTE_CONFIG = {
  '/': {
    title: <img src={acmeLogoDef} alt="Logo empresa" height="65em"/>,
    logo: '',
    returnPath: ''
  },
  '/registro-viajes': {
    title: 'Registro de Viajes',
    logo: <MapOutlinedIcon />,
    returnPath: '/registro-viajes'
  },
  '/registrar-viaje': {
    title: 'Registrar Viajes',
    logo: <MapOutlinedIcon />,
    returnPath: '/registro-viajes'
  },
  '/modificar-viaje': {
    title: 'Modificar Viaje',
    logo: <MapOutlinedIcon />,
    returnPath: '/registro-viajes'
  },
  '/seguimiento': {
    title: 'Seguimiento',
    logo: <MapOutlinedIcon />,
    returnPath: '/registro-viajes'
  },
  '/listado-viajes': {
    title: 'Listado de Viajes',
    logo: <MapOutlinedIcon />,
    returnPath: '/registro-viajes'
  },
  '/empresas': {
    title: 'Empresa Transportista',
    logo: <LanguageOutlinedIcon />,
    returnPath: '/empresas'
  },
  '/vehiculos': {
    title: 'Flota de Vehículos',
    logo: <LocalShippingOutlinedIcon />,
    returnPath: '/vehiculos'
  },
  '/choferes': {
    title: 'Choferes',
    logo: <PersonOutlinedIcon />,
    returnPath: '/choferes'
  },
  '/depositos': {
    title: 'Red de Depósitos',
    logo: <Inventory2OutlinedIcon />,
    returnPath: '/depositos'
  },
  '/reportes': {
    title: 'Reportes',
    logo: <SignalCellularAltOutlinedIcon />,
    returnPath: '/reportes'
  }
};
