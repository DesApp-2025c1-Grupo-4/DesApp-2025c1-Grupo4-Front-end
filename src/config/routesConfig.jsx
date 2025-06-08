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
    logo: <MapOutlinedIcon variant='biggerIcons'/>,
    returnPath: '/registro-viajes'
  },
  '/registrar-viaje': {
    title: 'Registrar Viajes',
    logo: <MapOutlinedIcon variant='biggerIcons'/>,
    returnPath: '/registro-viajes'
  },
  '/modificar-viaje': {
    title: 'Modificar Viaje',
    logo: <MapOutlinedIcon variant='biggerIcons'/>,
    returnPath: '/registro-viajes'
  },
  '/seguimiento': {
    title: 'Seguimiento',
    logo: <MapOutlinedIcon variant='biggerIcons'/>,
    returnPath: '/registro-viajes'
  },
  '/listado-viajes': {
    title: 'Listado de Viajes',
    logo: <MapOutlinedIcon variant='biggerIcons'/>,
    returnPath: '/registro-viajes'
  },
  '/empresas': {
    title: 'Empresa Transportista',
    logo: <LanguageOutlinedIcon variant='biggerIcons'/>,
    returnPath: ''
  },
  '/vehiculos': {
    title: 'Flota de Vehículos',
    logo: <LocalShippingOutlinedIcon variant='biggerIcons'/>,
    returnPath: ''
  },
  '/choferes': {
    title: 'Choferes',
    logo: <PersonOutlinedIcon variant='biggerIcons'/>,
    returnPath: ''
  },
  '/depositos': {
    title: 'Red de Depósitos',
    logo: <Inventory2OutlinedIcon variant='biggerIcons'/>,
    returnPath: ''
  },
  '/reportes': {
    title: 'Reportes',
    logo: <SignalCellularAltOutlinedIcon variant='biggerIcons'/>,
    returnPath: ''
  }
};
