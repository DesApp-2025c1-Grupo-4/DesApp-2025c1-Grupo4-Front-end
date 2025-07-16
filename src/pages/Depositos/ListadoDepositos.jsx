import { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Alert, IconButton } from '@mui/material';
import Filtro from '../../commonComponents/Filtro';
import Tabla2 from '../../commonComponents/Tabla2';
import Paginacion from '../../commonComponents/Paginacion';
import Popup from '../../commonComponents/Popup';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { getActiveDepositos,getDepositoById,createDeposito,updateDeposito,deleteDeposito} from '../../services/Depositos/DepositoService';

const ListadoDepositos = () => {
  const [filtros, setFiltros] = useState({ criterio: 'País', busqueda: '' });
  const [pagina, setPagina] = useState(1);
  const [itemsPorPagina] = useState(10);
  const [depositos, setDepositos] = useState([]);
  const [depositosFiltrados, setDepositosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [selectedDeposito, setSelectedDeposito] = useState(null);
  const [isLoadingDeposito, setIsLoadingDeposito] = useState(false);

  useEffect(() => {
    const fetchDepositos = async () => {
      try {
        const response = await getActiveDepositos();
        const depositosActivos = response.filter(item => item.activo !== false);

        const datosTransformados = depositosActivos.map(item => ({
          ...item,
          direccionCompleta: [
            item.localizacion?.direccion,
            item.localizacion?.ciudad,
            item.localizacion?.provincia_estado,
            item.localizacion?.pais
          ].filter(Boolean).join(', '),
          contacto: `${item.personal_contacto?.nombre || ''} ${item.personal_contacto?.apellido || ''}`.trim() || 'Sin contacto',
          horarios: item.horarios ? `${item.horarios.dias.join(', ')}: ${item.horarios.desde} - ${item.horarios.hasta}` : 'Sin horarios',
          horariosRaw: item.horarios,
          coordenadas: item.coordenadas?.coordinates 
            ? `${item.coordenadas.coordinates[1]}, ${item.coordenadas.coordinates[0]}`
            : 'Sin coordenadas'
        }));
        
        setDepositos(datosTransformados);
        setDepositosFiltrados(datosTransformados);
      } catch (err) {
        setError(`Error al cargar datos: ${err.message}`);
        console.error('Error fetching depositos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepositos();
  }, []);

const aplicarFiltros = () => {
  const searchTerm = filtros.busqueda.toLowerCase();

  const filtered = depositos.filter(deposito => {
    switch (filtros.criterio) {
      case 'Localización':
        return [
          deposito.localizacion?.direccion || '',
          deposito.localizacion?.ciudad || '',
          deposito.localizacion?.provincia_estado || '',
          deposito.localizacion?.pais || ''
        ].some(field => field.toLowerCase().includes(searchTerm));

      case 'Tipo':
        return (deposito.tipo || '').toLowerCase().includes(searchTerm);

      case 'Contacto':
        return (deposito.contacto || '').toLowerCase().includes(searchTerm);

      case 'País':
        return (deposito.localizacion?.pais || '').toLowerCase().includes(searchTerm);

      default:
        return true;
    }
  });

  setDepositosFiltrados(filtered);
  setPagina(1);
};

  const handleClear = () => {
    setFiltros(prev => ({ ...prev, criterio: 'País' }));
    setDepositosFiltrados(depositos);
    setPagina(1);
  };

  const depositosPaginaActual = () => {
    const inicio = (pagina - 1) * itemsPorPagina;
    return depositosFiltrados.slice(inicio, inicio + itemsPorPagina);
  };

  const handleOpenPopup = async (type, deposito = null) => {
    setPopupType(type);
    
    if (type === 'modificar-deposito' && deposito?._id) {
      setIsLoadingDeposito(true);
      try {
        const response = await getDepositoById(deposito._id);
        setSelectedDeposito({
          ...response,
          direccion: response.localizacion?.direccion || '',
          provincia: response.localizacion?.provincia_estado || '',
          ciudad: response.localizacion?.ciudad || '',
          pais: response.localizacion?.pais || '',
          nombreContacto: response.personal_contacto?.nombre || '',
          apellidoContacto: response.personal_contacto?.apellido || '',
          telefonoContacto: response.personal_contacto?.telefono || '',
          coordenadasRaw: response.coordenadas
        });
      } catch (error) {
        console.error('Error al cargar datos del depósito:', error);
        setSelectedDeposito(deposito);
      } finally {
        setIsLoadingDeposito(false);
        setPopupOpen(true);
      }
    } else {
      setSelectedDeposito(deposito);
      setPopupOpen(true);
    }
  };

  const handleAddDeposito = async (nuevoDeposito) => {
    try {
      const response = await createDeposito(nuevoDeposito);
      const newDeposito = {
        ...response,
        direccionCompleta: `${response.localizacion?.direccion || ''}, ${response.localizacion?.ciudad || ''}, ${response.localizacion?.provincia_estado || ''}`,
        contacto: `${response.personal_contacto?.nombre || ''} ${response.personal_contacto?.apellido || ''}`.trim() || 'Sin contacto',
        horarios: response.horarios ? `${response.horarios.dias.join(', ')}: ${response.horarios.desde} - ${response.horarios.hasta}` : 'Sin horarios'
      };
      setDepositos(prev => [newDeposito, ...prev]);
      setDepositosFiltrados(prev => [newDeposito, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Error al agregar depósito:', error);
      return { success: false, error: error.message };
    }
  };

const handleDeleteDeposito = async (depositoId) => {
  try {
    setLoading(true);
    await deleteDeposito(depositoId);
    setDepositos(prev => prev.filter(d => d._id !== depositoId));
    setDepositosFiltrados(prev => prev.filter(d => d._id !== depositoId));
    
    return true;
  } catch (error) {
    console.error('Error al eliminar:', error);
    setError(error.response?.data?.message || error.message);
    return false;
  } finally {
    setLoading(false);
  }
};

  const handleUpdateDeposito = async (updatedData) => {
    try {
      const response = await updateDeposito(updatedData._id, {
        tipo: updatedData.tipo,
        localizacion: {
          direccion: updatedData.direccion,
          ciudad: updatedData.ciudad,
          provincia_estado: updatedData.provincia,
          pais: updatedData.pais
        },
        personal_contacto: {
          nombre: updatedData.nombreContacto,
          apellido: updatedData.apellidoContacto,
          telefono: updatedData.telefonoContacto
        },
        horarios: updatedData.horarios,
        coordenadas: updatedData.coordenadasRaw || parseCoordinates(updatedData.coordenadas)
      });

      const updatedDeposito = {
        ...response,
        direccionCompleta: `${response.localizacion?.direccion || ''}, ${response.localizacion?.ciudad || ''}, ${response.localizacion?.provincia_estado || ''}`,
        contacto: `${response.personal_contacto?.nombre || ''} ${response.personal_contacto?.apellido || ''}`.trim() || 'Sin contacto',
        horarios: response.horarios ? `${response.horarios.dias.join(', ')}: ${response.horarios.desde} - ${response.horarios.hasta}` : 'Sin horarios'
      };

      setDepositos(prev => prev.map(d => d._id === updatedDeposito._id ? updatedDeposito : d));
      setDepositosFiltrados(prev => prev.map(d => d._id === updatedDeposito._id ? updatedDeposito : d));
      
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar depósito:', error);
      return { success: false, error: error.message };
    }
  };

  const parseCoordinates = (coordString) => {
    if (!coordString) return null;
    
    const [lat, long] = coordString.split(',').map(Number);
    if (isNaN(lat) || isNaN(long)) return null;
    
    return {
      type: "Point",
      coordinates: [long, lat] 
    };
  };

  const columns = [
    { id: 'tipo', label: 'Tipo', minWidth: 150, align: 'left' },
    { id: 'direccionCompleta', label: 'Localización', minWidth: 200, align: 'left' },
    { id: 'horarios', label: 'Horarios', minWidth: 200, align: 'left' },
    { id: 'contacto', label: 'Contacto', minWidth: 150, align: 'left' },
    {
      id: 'modificar', 
      label: 'Modificar', 
      minWidth: 80, 
      align: 'center',
      render: (_, row) => (
        <IconButton 
          onClick={() => handleOpenPopup('modificar-deposito', row)} 
          size="small" 
          color="primary"
          variant="tableButtons"
          disabled={isLoadingDeposito}
        >
          {isLoadingDeposito ? <CircularProgress size={20} /> : <CreateOutlinedIcon fontSize="small" variant="tableButtons" />}
        </IconButton>
      )
    },
    {
      id: 'eliminar', 
      label: 'Eliminar', 
      minWidth: 80, 
      align: 'center',
      render: (_, row) => (
        <IconButton 
          onClick={() => handleOpenPopup('confirmar-eliminar', row)} 
          size="small" 
          color="error"
          variant="tableButtons"
        >
          <CloseOutlinedIcon fontSize="small" variant="tableButtons" />
        </IconButton>
      )
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
        selectedItem={selectedDeposito}
        onDelete={async (id) => {
          const success = await handleDeleteDeposito(id);
          if (success) {
            setPopupOpen(false);
          }
        }}
        onSuccess={() => setPopupOpen(false)}
      />
      <Box mb={4}>
        <Filtro
          filtros={filtros}
          setFiltros={setFiltros}
          mode="depositos"
          onSearch={aplicarFiltros}
          onClear={handleClear}
        />
      </Box>

      <Box sx={{ 
        width: '85vw', 
        marginLeft: 'calc(-43vw + 50%)', 
        marginRight: 'calc(-40vw + 50%)', 
        overflowX: 'hidden' 
      }}>
        <Tabla2 
          columns={columns} 
          data={depositosPaginaActual()} 
          sx={{ 
            tableLayout: 'auto', 
            width: '100%',
            "& .MuiTableCell-root": {
              padding: "12px 16px",
              fontSize: "0.875rem",
              textAlign: "center",
              fontWeight: 500
            },
            "& .MuiTableCell-head": {
              backgroundColor: "#062B60",
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "0.875rem"
            }
          }} 
        />
      </Box>

      <Paginacion
        pagina={pagina}
        setPagina={setPagina}
        totalItems={depositosFiltrados.length}
        itemsPorPagina={itemsPorPagina}
        elemento="depósitos"
      />
    </Container>
  );
};

export { ListadoDepositos };