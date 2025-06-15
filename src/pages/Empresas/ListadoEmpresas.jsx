import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import Tabla2 from '../../commonComponents/Tabla2';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { getAllEmpresas } from '../../services/Empresas/EmpresaService';
import Paginacion from '../../commonComponents/Paginacion';
import Filtro from '../../commonComponents/Filtro';
import Popup from '../../commonComponents/Popup';
import { Grid, InputLabel, TextField } from '@mui/material';

export function ListadoEmpresas(){
  // Table state
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('name');
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 10;

  // Popup state
  const [openPopup, setOpenPopup] = useState(false);
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
  
  // Handle modificar click
  const handleModificar = (empresa) => {
    setSelectedEmpresa(empresa);
    setOpenPopup(true);
  };

  // Handle eliminar click
  const handleEliminar = () => {
    console.log('Eliminar empresa');
  };

  //Adding icons
  let listaCompleta = empresas.map(empresa => {
    return {
      ...empresa,
      modificar: (
        <IconButton 
          onClick={() => handleModificar(empresa)}
          variant="tableButtons"
        >
          <CreateOutlinedIcon variant="tableButtons"/>
        </IconButton>
      ),
      eliminar: (
        <IconButton 
          onClick={handleEliminar}
          variant="tableButtons"
        >
          <CloseOutlinedIcon variant="tableButtons"/>
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
      minWidth: 50
    },
    {
      id: 'eliminar',
      label: 'Eliminar',
      sortable: false,
      minWidth: 50
    },
  ];

  // Sort handler
  const handleSort = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  // Custom form for empresas
  const renderEmpresaForm = () => (
    <>
      <InputLabel required sx={{color: 'grey.900', fontWeight: 'bold'}}>Razon Social</InputLabel>
      <TextField
        fullWidth
        margin="dense"
        value={selectedEmpresa?.razonSocial || ''}
        sx={{backgroundColor: 'grey.50'}}
      />

      <InputLabel required sx={{color: 'grey.900', fontWeight: 'bold', pt: 2}}>CUIT/RUT</InputLabel>
      <TextField
        fullWidth
        margin="dense"
        value={selectedEmpresa?.cuit || ''}
        sx={{backgroundColor: 'grey.50'}}
      />

      <InputLabel required sx={{color: 'grey.900', fontWeight: 'bold', pt: 2}}>Domicilio Fiscal</InputLabel>
      <TextField
        fullWidth
        margin="dense"
        value={selectedEmpresa?.domicilioFiscal || ''}
        sx={{backgroundColor: 'grey.50'}}
      />

      <InputLabel required sx={{color: 'grey.900', fontWeight: 'bold', pt: 2}}>Telefono</InputLabel>
      <TextField
        fullWidth
        margin="dense"
        value={selectedEmpresa?.telefono || ''}
        sx={{backgroundColor: 'grey.50'}}
      />
    </>
  );

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

    {/* Popup para modificar empresa */}
    <Popup
      open={openPopup}
      onClose={() => setOpenPopup(false)}
      page="modificar-empresa"
      buttonName="Modificar empresa"
    >
      {renderEmpresaForm()}
    </Popup>
  </>
};