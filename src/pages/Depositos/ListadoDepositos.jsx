import { useState, useEffect } from 'react';
import { Box, IconButton, Grid, TextField, InputLabel } from '@mui/material';
import Tabla2 from '../../commonComponents/Tabla2';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { getAllDepositos } from '../../services/Depositos/DepositoService';
import Paginacion from '../../commonComponents/Paginacion';
import Filtro from '../../commonComponents/Filtro';
import Popup from '../../commonComponents/Popup';

export function ListadoDepositos() {
  // Table state
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('name');
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 10;

  // Popup state
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedDeposito, setSelectedDeposito] = useState(null);

  // Content state
  const [depositos, setDepositos] = useState([]);

  // Filtro state
  const [filtros, setFiltros] = useState({
    criterio: '',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: '',
  });

  // API Call
  useEffect(() => {
    async function fetchDepositos() {
      try {
        const depositos = await getAllDepositos();
        setDepositos(depositos);
      } catch (error) {
        console.log('ERROR FETCH API [depositos]: ' + error);
      }
    }
    fetchDepositos();
  }, []);

  // Handle modificar click
  const handleModificar = (deposito) => {
    setSelectedDeposito(deposito);
    setOpenPopup(true);
  };

  // Handle eliminar click (placeholder)
  const handleEliminar = () => {
    console.log('Eliminar deposito');
    // Aquí iría la lógica para eliminar el depósito
  };

  // Adding icons and actions
  let listaCompleta = depositos.map(deposito => {
    return {
      ...deposito,
      localizacion: `${deposito.localizacion?.calle} ${deposito.localizacion?.número}`,
      modificar: (
        <IconButton 
          onClick={() => handleModificar(deposito)}
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

  // Pagination
  const PaginaActual = (pagina) => {
    return listaCompleta.slice(
      (pagina - 1) * itemsPorPagina,
      pagina * itemsPorPagina
    );
  };

  // Columns configuration
  const columns = [
    { 
      id: '_id', 
      label: 'ID', 
      sortable: false,
      minWidth: 80 
    },
    { 
      id: 'tipo', 
      label: 'Tipo', 
      sortable: false,
      minWidth: 80
    },
    {
      id: 'localizacion',
      label: 'Localización',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'horarios',
      label: 'Horarios',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'contacto',
      label: 'Contacto',
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

  // Custom form for depositos
  const renderDepositoForm = () => (
    <Grid container spacing={2}>
      {/* Columna 1 */}
      <Grid item xs={6}>
        <InputLabel sx={{color: 'grey.900', fontWeight: 'bold'}}>Tipo</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          value={selectedDeposito?.tipo || ''}
          sx={{backgroundColor: 'grey.50'}}
        />

        <InputLabel sx={{color: 'grey.900', fontWeight: 'bold', mt: 2}}>Franja Horaria</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          value={selectedDeposito?.horarios || ''}
          sx={{backgroundColor: 'grey.50'}}
        />

        <InputLabel sx={{color: 'grey.900', fontWeight: 'bold', mt: 2}}>Localización</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          label="Dirección"
          value={selectedDeposito?.localizacion || ''}
          sx={{backgroundColor: 'grey.50', mb: 1}}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Provincia/Estado"
          value={selectedDeposito?.localizacion?.provincia || ''}
          sx={{backgroundColor: 'grey.50', mb: 1}}
        />
        <TextField
          fullWidth
          margin="dense"
          label="País"
          value={selectedDeposito?.localizacion?.pais || ''}
          sx={{backgroundColor: 'grey.50', mb: 1}}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Coordenadas"
          value={selectedDeposito?.localizacion?.coordenadas || ''}
          sx={{backgroundColor: 'grey.50'}}
        />
      </Grid>

      {/* Columna 2 */}
      <Grid item xs={6}>
        <InputLabel sx={{color: 'grey.900', fontWeight: 'bold'}}>Personal de Contacto</InputLabel>
        <TextField
          fullWidth
          margin="dense"
          label="Nombre"
          value={selectedDeposito?.contacto?.nombre || ''}
          sx={{backgroundColor: 'grey.50', mb: 1}}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Apellido"
          value={selectedDeposito?.contacto?.apellido || ''}
          sx={{backgroundColor: 'grey.50', mb: 1}}
        />
        <TextField
          fullWidth
          margin="dense"
          label="DNI"
          value={selectedDeposito?.contacto?.dni || ''}
          sx={{backgroundColor: 'grey.50', mb: 1}}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Teléfono"
          value={selectedDeposito?.contacto?.telefono || ''}
          sx={{backgroundColor: 'grey.50'}}
        />
      </Grid>
    </Grid>
  );

  return (
    <>
      <Box sx={{py:4, px:15}}>
        <Box mb={4}>
          <Filtro filtros={filtros} setFiltros={setFiltros} mode={'depositos'}/>
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
          elemento="depositos"
        />
      </Box>

      {/* Popup para modificar depósito */}
      <Popup
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        page="modificar-deposito"
        buttonName="Modificar depósito"
      >
        {renderDepositoForm()}
      </Popup>
    </>
  );
}