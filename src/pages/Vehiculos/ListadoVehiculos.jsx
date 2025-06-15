import { useState, useEffect } from 'react';
import { Box, IconButton, Grid, InputLabel, TextField } from '@mui/material';
import Tabla2 from '../../commonComponents/Tabla2';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { getAllVehiculos } from '../../services/Vehiculos/VehiculoService';
import Paginacion from '../../commonComponents/Paginacion';
import Filtro from '../../commonComponents/Filtro';
import Popup from '../../commonComponents/Popup';

export function ListadoVehiculos(){
  // Table state
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('name');
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 10;

  // Popup state
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);

  //Content state
  const [vehiculos, setVehiculos] = useState([]);

  //Componente filtro
  const [filtros, setFiltros] = useState({
    criterio: '',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: '',
  });
  
  //API Call
  useEffect(() => {
    async function fetchVehiculos() {
      try {
        const vehiculos = await getAllVehiculos();
        setVehiculos(vehiculos);
      } catch (error) {
        console.log('ERROR FETCH API [vehiculos]: ' + error);
      }
    }
    fetchVehiculos();
  }, []);
  
  // Handle modificar click
  const handleModificar = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setOpenPopup(true);
  };

  // Handle eliminar click
  const handleEliminar = () => {
    console.log('Eliminar vehículo');
  };

  //Adding icons
  let listaCompleta = vehiculos.map(vehiculo => {
    return {
      ...vehiculo,
      capacidad: `${vehiculo.volumen}m³ - ${vehiculo.peso}kg`,
      modificar: (
        <IconButton 
          onClick={() => handleModificar(vehiculo)}
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
      ),
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
      id: 'patente', 
      label: 'Patente', 
      sortable: false,
      minWidth: 80 
    },
    { 
      id: 'marca', 
      label: 'Marca', 
      sortable: false,
      minWidth: 80
    },
    {
      id: 'modelo',
      label: 'Modelo',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'año',
      label: 'Año',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'capacidad',
      label: 'Capacidad',
      sortable: false,
      minWidth: 50
    },
     {
      id: 'tipoVehiculo',
      label: 'Tipo de vehiculo',
      sortable: false,
      minWidth: 50
    },
    {
      id: 'empresa',
      label: 'Empresa',
      sortable: false,
      minWidth: 50
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

  // Custom form for vehiculos
  const renderVehiculoForm = () => (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <InputLabel required sx={{color: 'grey.900', fontWeight: 'bold'}}>Patente</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          value={selectedVehiculo?.patente || ''}
          sx={{backgroundColor: 'grey.50'}}
        />

        <InputLabel required sx={{color: 'grey.900', fontWeight: 'bold', mt: 2}}>Marca</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          value={selectedVehiculo?.marca || ''}
          sx={{backgroundColor: 'grey.50'}}
        />

        <InputLabel required sx={{color: 'grey.900', fontWeight: 'bold', mt: 2}}>Modelo</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          value={selectedVehiculo?.modelo || ''}
          sx={{backgroundColor: 'grey.50'}}
        />

        <InputLabel required sx={{color: 'grey.900', fontWeight: 'bold', mt: 2}}>Año</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          value={selectedVehiculo?.año || ''}
          sx={{backgroundColor: 'grey.50'}}
        />
      </Grid>

      <Grid item xs={6}>
        <InputLabel required sx={{color: 'grey.900', fontWeight: 'bold'}}>Tipo de Vehículo</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          value={selectedVehiculo?.tipoVehiculo || ''}
          sx={{backgroundColor: 'grey.50'}}
        />

        <InputLabel required sx={{color: 'grey.900', fontWeight: 'bold', mt: 2}}>Capacidad (Volumen)</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          value={selectedVehiculo?.volumen ? `${selectedVehiculo.volumen}m³` : ''}
          sx={{backgroundColor: 'grey.50'}}
        />

        <InputLabel required sx={{color: 'grey.900', fontWeight: 'bold', mt: 2}}>Capacidad (Peso)</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          value={selectedVehiculo?.peso ? `${selectedVehiculo.peso}kg` : ''}
          sx={{backgroundColor: 'grey.50'}}
        />

        <InputLabel sx={{color: 'grey.900', fontWeight: 'bold', mt: 2}}>Empresa</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          value={selectedVehiculo?.empresa || ''}
          sx={{backgroundColor: 'grey.50'}}
        />
      </Grid>
    </Grid>
  );

  return <>
    <Box sx={{py:4, px:15}}>
      <Box mb={4}>
          <Filtro filtros={filtros} setFiltros={setFiltros} mode={'vehiculos'}/>
      </Box>
      <Tabla2
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
        elemento="vehiculos"
      />
    </Box>

    {/* Popup para modificar vehículo */}
    <Popup
      open={openPopup}
      onClose={() => setOpenPopup(false)}
      page="modificar-vehiculo"
      buttonName="Modificar vehículo"
    >
      {renderVehiculoForm()}
    </Popup>
  </>
};