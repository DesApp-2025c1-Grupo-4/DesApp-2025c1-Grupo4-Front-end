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
  '/listado-viajes': {
    title: 'Listado de Viajes',
    logo: <MapOutlinedIcon variant='biggerIcons'/>,
    returnPath: '/listado-viajes'
  },
  '/registrar-viaje': {
    title: 'Registrar Viaje',
    logo: <MapOutlinedIcon variant='biggerIcons'/>,
    returnPath: '/listado-viajes',
    newButton: 'Registrar Nuevo Viaje'
  },  
  '/modificar-viaje': {
    title: 'Modificar Viaje',
    logo: <MapOutlinedIcon variant='biggerIcons'/>,
    returnPath: '/listado-viajes',
    newButton: 'Modificar Viaje'
  },
  '/seguimiento': {
    title: 'Seguimiento',
    logo: <MapOutlinedIcon variant='biggerIcons'/>,
    returnPath: '/listado-viajes',
    newButton: 'Nuevo Seguimiento'
  },
  '/empresas': {
    title: 'Empresa Transportista',
    logo: <LanguageOutlinedIcon variant='biggerIcons'/>,
    returnPath: '',
    newButton: 'Registrar nueva Empresa'
  },
  '/registrar-empresa': {
    title: 'Registrar Empresa',
    logo: <LanguageOutlinedIcon variant='biggerIcons'/>,
    returnPath: '/empresas',
    newButton: 'Registrar Empresa'
  },
  '/modificar-empresa': {
    title: 'Modificar Empresa',
    logo: <LanguageOutlinedIcon variant='biggerIcons'/>,
    returnPath: '/empresas',
    newButton: 'Modificar Empresa'
  },
  '/vehiculos': {
    title: 'Flota de Vehículos',
    logo: <LocalShippingOutlinedIcon variant='biggerIcons'/>,
    returnPath: '',
    newButton: 'Registrar Nuevo Vehículo'
  },
  '/registrar-vehiculo': {
    title: 'Registrar Vehículo',
    logo: <LocalShippingOutlinedIcon variant='biggerIcons'/>,
    returnPath: '/vehiculos',
    newButton: 'Registrar Vehículo'
  },
  '/modificar-vehiculo': {
    title: 'Modificar Vehículo',
    logo: <LocalShippingOutlinedIcon variant='biggerIcons'/>,
    returnPath: '/vehiculos',
    newButton: 'Modificar Vehiculo'
  },
  '/choferes': {
    title: 'Choferes',
    logo: <PersonOutlinedIcon variant='biggerIcons'/>,
    returnPath: '',
    newButton: 'Registrar Nuevo Chofer'
  },
  '/registrar-chofer': {
    title: 'Registrar Chofer',
    logo: <PersonOutlinedIcon variant='biggerIcons'/>,
    returnPath: '/choferes',
    newButton: 'Registrar Chofer'
  },
  '/modificar-chofer': {
    title: 'Modificar Chofer',
    logo: <PersonOutlinedIcon variant='biggerIcons'/>,
    returnPath: '/choferes',
    newButton: 'Modificar Chofer'
  },
  '/depositos': {
    title: 'Red de Depósitos',
    logo: <Inventory2OutlinedIcon variant='biggerIcons'/>,
    returnPath: '',
    newButton: 'Registrar Nuevo Depósito'
  },
  '/registrar-deposito': {
    title: 'Registrar Depósito',
    logo: <Inventory2OutlinedIcon variant='biggerIcons'/>,
    returnPath: '/depositos',
    newButton: 'Registrar Depósito'
  },
  '/modificar-deposito': {
    title: 'Modificar Depósito',
    logo: <Inventory2OutlinedIcon variant='biggerIcons'/>,
    returnPath: '/depositos',
    newButton: 'Modificar Depósito'
  },
  '/reportes': {
    title: 'Reportes',
    logo: <SignalCellularAltOutlinedIcon variant='biggerIcons'/>,
    returnPath: ''
  }
};