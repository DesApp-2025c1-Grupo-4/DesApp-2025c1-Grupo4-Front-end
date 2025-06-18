import { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Alert, IconButton } from '@mui/material';
import Filtro from '../../commonComponents/Filtro';
import Tabla2 from '../../commonComponents/Tabla2';
import Paginacion from '../../commonComponents/Paginacion';
import Popup from '../../commonComponents/Popup';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import axios from 'axios';
import { dateFormat } from '../../helpers/dateFormat';

const ListadoChoferes = () => {
  const [filtros, setFiltros] = useState({ criterio: 'CUIL', busqueda: '' });
  const [pagina, setPagina] = useState(1);
  const [itemsPorPagina] = useState(10);
  const [choferes, setChoferes] = useState([]);
  const [choferesFiltrados, setChoferesFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [selectedChofer, setSelectedChofer] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchChoferes();
  }, []);

 const fetchChoferes = async () => {
  try {
    setLoading(true);
    const response = await axios.get('/api/choferes');

    const datosTransformados = response.data.map(item => ({
      ...item,
      fechaNacimiento: dateFormat(item.fecha_nacimiento),
      empresa: item.empresa?.nombre_empresa || '',
      vehiculoAsignado: item.vehiculo_defecto?.patente || 'Sin vehículo'
    }));

    setChoferes(datosTransformados);
    setChoferesFiltrados(datosTransformados);
  } catch (err) {
    setError(`Error al cargar datos: ${err.message}`);
    console.error('Error fetching choferes:', err);
  } finally {
    setLoading(false);
  }
};

  // Función para aplicar filtros localmente
  const aplicarFiltros = () => {
    setIsSearching(true);
    try {
      const filtered = choferes.filter(chofer => {
        if (filtros.busqueda) {
          const searchTerm = filtros.busqueda.toLowerCase();
          switch (filtros.criterio) {
            case 'CUIL':
              return (chofer.cuil || '').toLowerCase().includes(searchTerm);
            case 'Nombre':
              return (chofer.nombre || '').toLowerCase().includes(searchTerm);
            case 'Apellido':
              return (chofer.apellido || '').toLowerCase().includes(searchTerm);
            case 'Empresa':
              return (chofer.empresa || '').toLowerCase().includes(searchTerm);
            default:
              return true;
          }
        }
        return true;
      });
      setChoferesFiltrados(filtered);
      setPagina(1);
    } catch (err) {
      console.error('Error al filtrar choferes:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setFiltros({ criterio: 'CUIL', busqueda: '' });
    setChoferesFiltrados(choferes);
    setPagina(1);
  };

  const choferesPaginaActual = () => {
    const inicio = (pagina - 1) * itemsPorPagina;
    return choferesFiltrados.slice(inicio, inicio + itemsPorPagina);
  };

const handleOpenPopup = async (type, chofer = null) => {
  setPopupType(type);
  
  if (type === 'modificar-chofer' && chofer) {
    // Usamos directamente los datos de la lista sin consultar al backend
    setSelectedChofer({
      ...chofer,
      nombre: chofer.nombre || '',
      apellido: chofer.apellido || '',
      cuil: chofer.cuil || '',
      fechaNacimiento: chofer.fecha_nacimiento 
        ? new Date(chofer.fecha_nacimiento).toISOString().split('T')[0] 
        : '',
      empresa: chofer.empresa || '',
      vehiculoAsignado: chofer.vehiculoAsignado || ''
    });
  } else {
    setSelectedChofer(chofer);
  }
  
  setPopupOpen(true);
};

  const handleDeleteChofer = async (cuil) => {
  try {
    await axios.patch(`/api/choferes/${cuil}/delete`);
    // Recargamos la lista completa desde el backend
    await fetchChoferes();
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar chofer:', error);
    return { success: false, error: error.message };
  }
};

  const columns = [
    { id: 'nombre', label: 'Nombre', minWidth: 120, align: 'left' },
    { id: 'apellido', label: 'Apellido', minWidth: 120, align: 'left' },
    { id: 'cuil', label: 'CUIL', minWidth: 150, align: 'left' },
    { id: 'fechaNacimiento', label: 'Fecha Nacimiento', minWidth: 150, align: 'left' },
    { id: 'empresa', label: 'Empresa', minWidth: 150, align: 'left' },
    { id: 'vehiculoAsignado', label: 'Vehículo Asignado', minWidth: 150, align: 'left' },
    {
      id: 'modificar', label: 'Modificar', minWidth: 80, align: 'center',
      render: (_, row) => <IconButton onClick={() => handleOpenPopup('modificar-chofer', row)} size="small" color="primary">
        <CreateOutlinedIcon fontSize="small" />
      </IconButton>
    },
    {
      id: 'eliminar', label: 'Eliminar', minWidth: 80, align: 'center',
      render: (_, row) => <IconButton onClick={() => handleOpenPopup('confirmar-eliminar', row)} size="small" color="error">
        <CloseOutlinedIcon fontSize="small" />
      </IconButton>
    }
  ];

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Popup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        page={popupType}
        selectedItem={selectedChofer}
        onDelete={popupType === 'confirmar-eliminar' ? handleDeleteChofer : null}
        buttonName={popupType === 'modificar-chofer' ? 'Modificar Chofer' : popupType === 'confirmar-eliminar' ? 'Eliminar Chofer' : 'Aceptar'}
        message={popupType === 'confirmar-eliminar' ? '¿Está seguro que desea eliminar este chofer?' : ''}
      />

      <Box mb={4}>
        <Filtro
          filtros={filtros}
          setFiltros={setFiltros}
          mode="choferes"
          onClear={handleClear}
          onBuscar={aplicarFiltros}
          isSearching={isSearching}
        />
      </Box>

      <Box sx={{ width: '85vw', marginLeft: 'calc(-43vw + 50%)', marginRight: 'calc(-40vw + 50%)', overflowX: 'hidden' }}>
        <Tabla2 columns={columns} data={choferesPaginaActual()} sx={{ tableLayout: 'auto', width: '100%' }} />
      </Box>

      <Paginacion
        pagina={pagina}
        setPagina={setPagina}
        totalItems={choferesFiltrados.length}
        itemsPorPagina={itemsPorPagina}
        elemento="choferes"
      />
    </Container>
  );
};

export { ListadoChoferes };