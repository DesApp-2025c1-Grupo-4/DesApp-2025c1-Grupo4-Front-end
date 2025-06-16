import { useState, useEffect } from 'react';
import { Box, IconButton, Grid, InputLabel, TextField } from '@mui/material';
import Tabla2 from '../../commonComponents/Tabla2';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { getAllEmpresas } from '../../services/Empresas/EmpresaService';
import Paginacion from '../../commonComponents/Paginacion';
import Filtro from '../../commonComponents/Filtro';
import Popup from '../../commonComponents/Popup';

export function ListadoEmpresas(){
  // Table state
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('name');
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 10;

  // Popup state (unificado como en ListadoViajes)
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  //Content state
  const [empresas, setEmpresas] = useState([]);

  //Componente filtro
  const [filtros, setFiltros] = useState({
    criterio: '',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: '',
  });
  
  //API Call
  useEffect(() => {
    async function fetchEmpresas() {
      try {
        const empresas = await getAllEmpresas();
        setEmpresas(empresas);
      } catch (error) {
        console.log('ERROR FETCH API [empresas]: ' + error);
      }
    }
    fetchEmpresas();
  }, []);
  
  // Handle popup open
  const handleOpenPopup = (type, empresa = null) => {
    setPopupType(type);
    setSelectedEmpresa(empresa);
    setPopupOpen(true);
  };

  //Adding icons
  let listaCompleta = empresas.map(empresa => {
    return {
      ...empresa,
      modificar: (
        <IconButton 
          onClick={() => handleOpenPopup('modificar-empresa', empresa)}
          size="small"
        >
          <CreateOutlinedIcon fontSize="small"/>
        </IconButton>
      ),
      eliminar: (
        <IconButton 
          onClick={() => handleOpenPopup('confirmar-eliminar', empresa)}
          size="small"
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <CloseOutlinedIcon fontSize="small"/>
        </IconButton>
      )
    };
  });

  //Parametros para paginado
  const PaginaActual = (pagina) => {
    return listaCompleta.slice(
      (pagina - 1) * itemsPorPagina,
      pagina * itemsPorPagina
    );
  };

  // Columns configuration
  const columns = [
    { 
      id: 'razonSocial', 
      label: 'Razón Social', 
      sortable: false,
      minWidth: 80 
    },
    { 
      id: 'cuit', 
      label: 'CUIT/RUT', 
      sortable: false,
      minWidth: 80
    },
    {
      id: 'domicilioFiscal',
      label: 'Domicilio Fiscal',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'telefono',
      label: 'Teléfono',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'modificar',
      label: 'Modificar',
      sortable: false,
      width: '5%'
    },
    {
      id: 'eliminar',
      label: 'Eliminar',
      sortable: false,
      width: '5%'
    }
  ];

  // Sort handler
  const handleSort = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  return <>
    <Box sx={{py:4, px:15}}>
      <Box mb={4}>
          <Filtro filtros={filtros} setFiltros={setFiltros} mode={'empresas'}/>
      </Box>
      <Tabla2 mb={4}
        columns={columns}
        data={PaginaActual(pagina)}
        sortDirection={sortDirection}
        sortBy={sortBy}
        onSort={handleSort}
      />
      <Paginacion
        pagina={pagina}
        setPagina={setPagina}
        totalItems={listaCompleta.length}
        itemsPorPagina={itemsPorPagina}
        elemento="empresas"
      />
    </Box>

    {/* Popup */}
    <Popup
      open={popupOpen}
      onClose={() => setPopupOpen(false)}
      page={popupType}
      selectedItem={selectedEmpresa}
      buttonName={
        popupType === 'modificar-empresa' ? 'Modificar Empresa' :
        popupType === 'confirmar-eliminar' ? 'Eliminar Empresa' :
        'Aceptar'
      }
    />
  </>
};