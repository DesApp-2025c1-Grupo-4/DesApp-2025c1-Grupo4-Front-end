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
        const datosTransformados = response.data.map(item => ({
          ...item,
          direccionCompleta: `${item.localizacion?.direccion || ''}, ${item.localizacion?.ciudad || ''}, ${item.localizacion?.provincia_estado || ''}`,
          contacto: `${item.personal_contacto?.nombre || ''} ${item.personal_contacto?.apellido || ''}`.trim() || 'Sin contacto',
          horarios: item.horarios ? `${item.horarios.dias.join(', ')}: ${item.horarios.desde} - ${item.horarios.hasta}` : 'Sin horarios'
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
    const filtered = depositos.filter(deposito => {
      const searchTerm = filtros.busqueda.toLowerCase();
      switch (filtros.criterio) {
        case 'Localización':
          return (deposito.direccionCompleta || '').toLowerCase().includes(searchTerm);
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
      
      // Extraer número de la dirección si existe
      const direccionCompleta = response.data.localizacion?.direccion || '';
      let calle = direccionCompleta;
      let numero = '';
      
      const match = direccionCompleta.match(/(.+?)\s*(\d+)\s*$/);
      if (match) {
        calle = match[1].trim();
        numero = match[2].trim();
      }

      setSelectedDeposito({
        ...response.data,
        tipo: response.data.tipo || '',
        horarios: response.data.horarios ? 
          `${response.data.horarios.dias.join(', ')}: ${response.data.horarios.desde} - ${response.data.horarios.hasta}` : '',
        localizacion: {
          calle: calle,
          número: numero,
          provincia: response.data.localizacion?.provincia_estado || 'Buenos Aires',
          pais: 'Argentina',
          coordenadas: response.data.localizacion?.coordenadas || ''
        },
        contacto: {
          nombre: response.data.personal_contacto?.nombre || '',
          apellido: response.data.personal_contacto?.apellido || '',
          dni: response.data.personal_contacto?.dni || '',
          telefono: response.data.personal_contacto?.telefono || ''
        },
        razonSocial: response.data.razon_social || response.data.razonSocial || '',
        cuit: response.data.cuit || response.data.cuit_rut || ''
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

  const handleUpdateDeposito = async (depositoActualizado) => {
    try {
      const response = await axios.put(`/api/depositos/${depositoActualizado._id}`, depositoActualizado);
      const updatedDeposito = {
        ...response.data,
        direccionCompleta: `${response.data.localizacion?.direccion || ''}, ${response.data.localizacion?.ciudad || ''}, ${response.data.localizacion?.provincia_estado || ''}`,
        contacto: `${response.data.personal_contacto?.nombre || ''} ${response.data.personal_contacto?.apellido || ''}`.trim() || 'Sin contacto',
        horarios: response.data.horarios ? `${response.data.horarios.dias.join(', ')}: ${response.data.horarios.desde} - ${response.data.horarios.hasta}` : 'Sin horarios'
      };
      setDepositos(prev => prev.map(d => d._id === depositoActualizado._id ? updatedDeposito : d));
      setDepositosFiltrados(prev => prev.map(d => d._id === depositoActualizado._id ? updatedDeposito : d));
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar depósito:', error);
      return { success: false, error: error.message };
    }
  };

  const handleDeleteDeposito = async (id) => {
    try {
      await axios.delete(`/api/depositos/${id}`);
      setDepositos(prev => prev.filter(d => d._id !== id));
      setDepositosFiltrados(prev => prev.filter(d => d._id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar depósito:', error);
      return { success: false, error: error.message };
    }
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
        onAddItem={handleAddDeposito}
        onUpdateItem={handleUpdateDeposito}
        onDelete={popupType === 'confirmar-eliminar' ? handleDeleteDeposito : null}
        buttonName={popupType === 'modificar-deposito' ? 'Modificar Depósito' : 'Eliminar Depósito'}
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