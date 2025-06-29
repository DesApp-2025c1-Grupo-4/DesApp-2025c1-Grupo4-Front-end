import { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Alert, IconButton } from '@mui/material';
import Filtro from '../../commonComponents/Filtro';
import Tabla2 from '../../commonComponents/Tabla2';
import Paginacion from '../../commonComponents/Paginacion';
import Popup from '../../commonComponents/Popup';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import axios from 'axios';

const ListadoDepositos = () => {
  const [filtros, setFiltros] = useState({ criterio: 'Localización', busqueda: '' });
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
        const response = await axios.get('/api/depositos');
        const datosTransformados = response.data
          .filter(item => item.activo !== false) 
          .map(item => ({
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

      default:
        return true;
    }
  });

  setDepositosFiltrados(filtered);
  setPagina(1);
};


  const handleClear = () => {
    setFiltros({ criterio: 'Localización', busqueda: '' });
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
      const response = await axios.get(`/api/depositos/${deposito._id}`);
      setSelectedDeposito({
        ...response.data,
        direccion: response.data.localizacion?.direccion || '',
        provincia: response.data.localizacion?.provincia_estado || '',
        ciudad: response.data.localizacion?.ciudad || '',
        pais: response.data.localizacion?.pais || '',
        nombreContacto: response.data.personal_contacto?.nombre || '',
        apellidoContacto: response.data.personal_contacto?.apellido || '',
        telefonoContacto: response.data.personal_contacto?.telefono || '',
        coordenadasRaw: response.data.coordenadas
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
      const response = await axios.post('/api/depositos', nuevoDeposito);
      const newDeposito = {
        ...response.data,
        direccionCompleta: `${response.data.localizacion?.direccion || ''}, ${response.data.localizacion?.ciudad || ''}, ${response.data.localizacion?.provincia_estado || ''}`,
        contacto: `${response.data.personal_contacto?.nombre || ''} ${response.data.personal_contacto?.apellido || ''}`.trim() || 'Sin contacto',
        horarios: response.data.horarios ? `${response.data.horarios.dias.join(', ')}: ${response.data.horarios.desde} - ${response.data.horarios.hasta}` : 'Sin horarios'
      };
      setDepositos(prev => [newDeposito, ...prev]);
      setDepositosFiltrados(prev => [newDeposito, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Error al agregar depósito:', error);
      return { success: false, error: error.message };
    }
  };

const handleDeleteDeposito = async (deposito) => {
  try {
    console.log('Iniciando eliminación del depósito:', deposito._id);
    
    // Opción 1: Intento con PATCH (soft delete)
    try {
      const response = await axios.patch(`/api/depositos/${deposito._id}/delete`, {
        activo: false,
        coordenadas: deposito.coordenadasRaw || {
          type: "Point",
          coordinates: [0, 0] // Valor por defecto
        }
      });
      
      console.log('Respuesta del servidor:', response.data);
      
      // Actualizar estado si fue exitoso
      setDepositos(prev => prev.filter(d => d._id !== deposito._id));
      setDepositosFiltrados(prev => prev.filter(d => d._id !== deposito._id));
      
      return {
        success: true,
        message: response.data.message || 'Depósito desactivado correctamente'
      };
      
    } catch (patchError) {
      console.warn('Error con PATCH:', patchError.response?.data);
      
      // Opción 2: Intento alternativo con POST
      try {
        const postResponse = await axios.post(`/api/depositos/${deposito._id}/delete`, {
          activo: false
        });
        
        console.log('Respuesta POST:', postResponse.data);
        
        setDepositos(prev => prev.filter(d => d._id !== deposito._id));
        setDepositosFiltrados(prev => prev.filter(d => d._id !== deposito._id));
        
        return {
          success: true,
          message: postResponse.data.message || 'Depósito eliminado (vía POST)'
        };
        
      } catch (postError) {
        console.error('Error con POST:', postError.response?.data);
        throw postError; // Pasamos al manejo de errores general
      }
    }
    
  } catch (error) {
    // Manejo final de errores
    const errorData = error.response?.data || {};
    console.error('Error completo:', errorData);
    
    // Opción 3: Eliminación solo en frontend con advertencia
    setDepositos(prev => prev.filter(d => d._id !== deposito._id));
    setDepositosFiltrados(prev => prev.filter(d => d._id !== deposito._id));
    
    return {
      success: false,
      error: 'El depósito fue eliminado localmente pero persiste en el servidor. ' +
             `Error del servidor: ${errorData.message || '500 Internal Server Error'}`,
      localDelete: true
    };
  }
};

const handleUpdateDeposito = async (updatedData) => {
  try {
    const response = await axios.patch(`/api/depositos/${updatedData._id}`, {
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

    // Update local state
    const updatedDeposito = {
      ...response.data,
      direccionCompleta: `${response.data.localizacion?.direccion || ''}, ${response.data.localizacion?.ciudad || ''}, ${response.data.localizacion?.provincia_estado || ''}`,
      contacto: `${response.data.personal_contacto?.nombre || ''} ${response.data.personal_contacto?.apellido || ''}`.trim() || 'Sin contacto',
      horarios: response.data.horarios ? `${response.data.horarios.dias.join(', ')}: ${response.data.horarios.desde} - ${response.data.horarios.hasta}` : 'Sin horarios'
    };

    setDepositos(prev => prev.map(d => d._id === updatedDeposito._id ? updatedDeposito : d));
    setDepositosFiltrados(prev => prev.map(d => d._id === updatedDeposito._id ? updatedDeposito : d));
    
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar depósito:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to parse coordinates string to GeoJSON format
const parseCoordinates = (coordString) => {
  if (!coordString) return null;
  
  const [lat, long] = coordString.split(',').map(Number);
  if (isNaN(lat) || isNaN(long)) return null;
  
  return {
    type: "Point",
    coordinates: [long, lat] // GeoJSON uses [longitude, latitude] order
  };
};



  const columns = [
    { id: '_id', label: 'ID', minWidth: 100, align: 'left', render: (value) => value?.toString() || 'N/A' },
    { id: 'tipo', label: 'Tipo', minWidth: 150, align: 'left' },
    { id: 'direccionCompleta', label: 'Localización', minWidth: 200, align: 'left' },
    { id: 'horarios', label: 'Horarios', minWidth: 200, align: 'left' },
    { id: 'contacto', label: 'Contacto', minWidth: 150, align: 'left' },
    {
      id: 'modificar', label: 'Modificar', minWidth: 80, align: 'center',
      render: (_, row) => (
        <IconButton 
          onClick={() => handleOpenPopup('modificar-deposito', row)} 
          size="small" 
          color="primary"
          disabled={isLoadingDeposito}
        >
          {isLoadingDeposito ? <CircularProgress size={20} /> : <CreateOutlinedIcon fontSize="small" />}
        </IconButton>
      )
    },
    {
      id: 'eliminar', label: 'Eliminar', minWidth: 80, align: 'center',
      render: (_, row) => (
        <IconButton 
          onClick={() => handleOpenPopup('confirmar-eliminar', row)} 
          size="small" 
          color="error"
        >
          <CloseOutlinedIcon fontSize="small" />
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
        onDelete={handleDeleteDeposito}
        onSuccess={(result) => {
          if (result.error) {
            alert(`Atención: ${result.error}`);
          }
          setPopupOpen(false);
          if (result.localDelete) {
            setTimeout(() => {
              alert('Por favor recargue la página para sincronizar con el servidor');
            }, 1000);
          }
        }}
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

      <Box sx={{ width: '85vw', marginLeft: 'calc(-43vw + 50%)', marginRight: 'calc(-40vw + 50%)', overflowX: 'hidden' }}>
        <Tabla2 columns={columns} data={depositosPaginaActual()} sx={{ tableLayout: 'auto', width: '100%' }} />
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
