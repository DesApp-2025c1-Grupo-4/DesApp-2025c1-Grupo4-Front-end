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
import ChoferForm from '../../commonComponents/forms/ChoferForm';

const ListadoChoferes = () => {
  const [filtros, setFiltros] = useState({ criterio: 'CUIL', busqueda: '' });
  const [filtrosAplicados, setFiltrosAplicados] = useState({ criterio: 'CUIL', busqueda: '' });
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

  // Fetch choferes activos (activo !== false)
  const fetchChoferes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/choferes');

      const datosTransformados = response.data
        .filter(item => item.activo !== false) // solo activos
        .map(item => ({
          ...item,
          _id: item._id,
          fechaNacimiento: dateFormat(item.fecha_nacimiento),
          empresa: item.empresa?.nombre_empresa || '',
          vehiculoAsignado: item.vehiculo_defecto ? `${item.vehiculo_defecto.patente}` : 'Sin vehículo',
          empresaObj: item.empresa || null,
          vehiculoObj: item.vehiculo_defecto || null
        }));

      setChoferes(datosTransformados);
      setChoferesFiltrados(datosTransformados);
      setError(null);
    } catch (err) {
      setError(`Error al cargar datos: ${err.message}`);
      console.error('Error fetching choferes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Aplica filtros desde filtrosAplicados
  useEffect(() => {
    const filtered = choferes.filter(chofer => {
      if (filtrosAplicados.busqueda) {
        const searchTerm = filtrosAplicados.busqueda.toLowerCase();
        switch (filtrosAplicados.criterio) {
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
  }, [filtrosAplicados, choferes]);

  const aplicarFiltros = () => {
    setIsSearching(true);
    setFiltrosAplicados({ ...filtros });
    setIsSearching(false);
  };

  const limpiarFiltros = () => {
    setFiltros({ criterio: 'CUIL', busqueda: '' });
    setFiltrosAplicados({ criterio: 'CUIL', busqueda: '' });
  };

  const choferesPaginaActual = () => {
    const inicio = (pagina - 1) * itemsPorPagina;
    return choferesFiltrados.slice(inicio, inicio + itemsPorPagina);
  };

  // Abre el popup y setea chofer seleccionado
  const handleOpenPopup = async (type, chofer = null) => {
    setPopupType(type);

    if (type === 'modificar-chofer' && chofer) {
      try {
        const response = await axios.get(`/api/choferes/${chofer._id}`);
        const choferData = response.data;
        setSelectedChofer({
          ...choferData,
          _id: choferData._id,
          nombre: choferData.nombre || '',
          apellido: choferData.apellido || '',
          cuil: choferData.cuil || '',
          fechaNacimiento: choferData.fecha_nacimiento ? new Date(choferData.fecha_nacimiento) : null,
          empresa: choferData.empresa || null,
          vehiculoAsignado: choferData.vehiculo_defecto || null,
          empresasDisponibles: [],
          vehiculosDisponibles: []
        });
      } catch (error) {
        console.error('Error al cargar datos del chofer:', error);
        setSelectedChofer({
          ...chofer,
          _id: chofer._id,
          nombre: chofer.nombre || '',
          apellido: chofer.apellido || '',
          cuil: chofer.cuil || '',
          fechaNacimiento: chofer.fecha_nacimiento ? new Date(chofer.fecha_nacimiento) : null,
          empresa: chofer.empresaObj || null,
          vehiculoAsignado: chofer.vehiculoObj || null,
          empresasDisponibles: [],
          vehiculosDisponibles: []
        });
      }
    } else if (type === 'confirmar-eliminar' && chofer) {
      setSelectedChofer(chofer);
    } else {
      // Nuevo chofer
      try {
        const [empresasResponse, vehiculosResponse] = await Promise.all([
          axios.get('/api/empresas'),
          axios.get('/api/vehiculos')
        ]);

        setSelectedChofer({
          nombre: '',
          apellido: '',
          cuil: '',
          fechaNacimiento: null,
          empresa: null,
          vehiculoAsignado: null,
          empresasDisponibles: empresasResponse.data,
          vehiculosDisponibles: vehiculosResponse.data
        });
      } catch (error) {
        console.error('Error al cargar listados:', error);
        setSelectedChofer({
          empresasDisponibles: [],
          vehiculosDisponibles: []
        });
      }
    }
    setPopupOpen(true);
  };

  // Función para desactivar chofer (set activo: false)
 const handleDeleteChofer = async (id) => {
  try {
    // Primero obtener los datos actuales del chofer
    const { data: currentData } = await axios.get(`/api/choferes/${id}`);
    
    // Preparar los datos para enviar (marcar como inactivo)
    const dataToSend = {
      nombre: currentData.nombre,
      apellido: currentData.apellido,
      cuil: currentData.cuil,
      fecha_nacimiento: currentData.fecha_nacimiento,
      empresa: typeof currentData.empresa === 'object' ? currentData.empresa._id : currentData.empresa,
      vehiculo_defecto: typeof currentData.vehiculo_defecto === 'object' ? 
                       currentData.vehiculo_defecto._id : 
                       currentData.vehiculo_defecto,
      activo: false
    };

    // Enviar la actualización
    await axios.put(`/api/choferes/${id}`, dataToSend);
    
    // Actualizar los estados
    setChoferes(prev => prev.filter(c => c._id !== id));
    setChoferesFiltrados(prev => prev.filter(c => c._id !== id));
    setPopupOpen(false);
    
    return { success: true };
  } catch (error) {
    console.error('Error al desactivar chofer:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Error al desactivar el chofer',
      details: error.response?.data
    };
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
      id: 'modificar',
      label: 'Modificar',
      minWidth: 80,
      align: 'center',
      render: (_, row) => (
        <IconButton onClick={() => handleOpenPopup('modificar-chofer', row)} size="small" color="primary">
          <CreateOutlinedIcon fontSize="small" />
        </IconButton>
      )
    },
    {
      id: 'eliminar',
      label: 'Eliminar',
      minWidth: 80,
      align: 'center',
      render: (_, row) => (
        <IconButton onClick={() => handleOpenPopup('confirmar-eliminar', row)} size="small" color="error">
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
        selectedItem={selectedChofer}
        onDelete={popupType === 'confirmar-eliminar' && selectedChofer
          ? () => handleDeleteChofer(selectedChofer._id)
          : null
        }
        onSubmit={popupType === 'modificar-chofer' ? handleSubmitChofer : null}
        buttonName={
          popupType === 'modificar-chofer'
            ? 'Modificar Chofer'
            : popupType === 'confirmar-eliminar'
            ? 'Eliminar Chofer'
            : 'Aceptar'
        }
        message={popupType === 'confirmar-eliminar' ? '¿Está seguro que desea eliminar este chofer?' : ''}
        FormComponent={popupType === 'modificar-chofer' ? ChoferForm : null}
      />

      <Box mb={4}>
        <Filtro
          filtros={filtros}
          setFiltros={setFiltros}
          mode="choferes"
          onClear={limpiarFiltros}
          onSearch={aplicarFiltros}
          isSearching={isSearching}
        />
      </Box>

      <Box
        sx={{
          width: '85vw',
          marginLeft: 'calc(-43vw + 50%)',
          marginRight: 'calc(-40vw + 50%)',
          overflowX: 'hidden'
        }}
      >
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
