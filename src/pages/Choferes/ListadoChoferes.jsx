import { useState, useEffect } from 'react';
import { Box, IconButton, Grid, InputLabel, TextField } from '@mui/material';
import Tabla2 from '../../commonComponents/Tabla2';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { getAllChoferes } from '../../services/Choferes/ChoferService';
import Paginacion from '../../commonComponents/Paginacion';
import Filtro from '../../commonComponents/Filtro';
import { dateFormat } from '../../helpers/dateFormat';
import Popup from '../../commonComponents/Popup';

export function ListadoChoferes(){
  // Table state
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('name');
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 10;

  // Popup state
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedChofer, setSelectedChofer] = useState(null);

  //Content state
  const [choferes, setChoferes] = useState([]);

  //Componente filtro
  const [filtros, setFiltros] = useState({
    criterio: '',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: '',
  });
  
  //API Call
  useEffect(() => {
    async function fetchChoferes() {
      try {
        const choferes = await getAllChoferes();
        setChoferes(choferes);
      } catch (error) {
        console.log('ERROR FETCH API [choferes]: ' + error);
      }
    }
    fetchChoferes();
  }, []);
  
  // Handle modificar click
  const handleModificar = (chofer) => {
    setSelectedChofer(chofer);
    setOpenPopup(true);
  };

  // Handle eliminar click
  const handleEliminar = () => {
    console.log('Eliminar chofer');
  };

  //Adding icons
  let listaCompleta = choferes.map(chofer => {
    return {
      ...chofer,
      fechaNacimiento: dateFormat(chofer.fechaNacimiento),
      modificar: (
        <IconButton 
          onClick={() => handleModificar(chofer)}
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
      id: 'nombre', 
      label: 'Nombre', 
      sortable: false,
      minWidth: 80 
    },
    { 
      id: 'apellido', 
      label: 'Apellido', 
      sortable: false,
      minWidth: 80
    },
    {
      id: 'cuil',
      label: 'CUIL',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'fechaNacimiento',
      label: 'Fecha de nacimiento',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'empresa',
      label: 'Empresa',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'asignaciones',
      label: 'Vehículo asignado',
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

  // Custom form for choferes
  const renderChoferForm = () => (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <InputLabel required sx={{color: 'grey.900', fontWeight: 'bold'}}>Nombre</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          value={selectedChofer?.nombre || ''}
          sx={{backgroundColor: 'grey.50'}}
        />

        <InputLabel required sx={{color: 'grey.900', fontWeight: 'bold', mt: 2}}>Apellido</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          value={selectedChofer?.apellido || ''}
          sx={{backgroundColor: 'grey.50'}}
        />

        <InputLabel required sx={{color: 'grey.900', fontWeight: 'bold', mt: 2}}>CUIL</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          value={selectedChofer?.cuil || ''}
          sx={{backgroundColor: 'grey.50'}}
        />
      </Grid>

      <Grid item xs={6}>
        <InputLabel required sx={{color: 'grey.900', fontWeight: 'bold'}}>Fecha de Nacimiento</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={selectedChofer?.fechaNacimiento || ''}
          sx={{backgroundColor: 'grey.50'}}
        />

        <InputLabel required sx={{color: 'grey.900', fontWeight: 'bold', mt: 2}}>Empresa</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          value={selectedChofer?.empresa || ''}
          sx={{backgroundColor: 'grey.50'}}
        />

        <InputLabel sx={{color: 'grey.900', fontWeight: 'bold', mt: 2}}>Vehículo Asignado</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          value={selectedChofer?.vehiculoAsignado || ''}
          sx={{backgroundColor: 'grey.50'}}
        />
      </Grid>
    </Grid>
  );

  return <>
    <Box sx={{py:4, px:15}}>
      <Box mb={4}>
          <Filtro filtros={filtros} setFiltros={setFiltros} mode={'choferes'}/>
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
        elemento="choferes"
      />
    </Box>

    {/* Popup para modificar chofer */}
    <Popup
      open={openPopup}
      onClose={() => setOpenPopup(false)}
      page="modificar-chofer"
      buttonName="Modificar chofer"
    >
      {renderChoferForm()}
    </Popup>
  </>
};