import { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Alert, IconButton } from '@mui/material';
import Filtro from '../../commonComponents/Filtro';
import Tabla2 from '../../commonComponents/Tabla2';
import Paginacion from '../../commonComponents/Paginacion';
import Popup from '../../commonComponents/Popup';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import axios from 'axios';

const ListadoEmpresas = () => {
  const [filtros, setFiltros] = useState({
    criterio: 'Razón Social',
    busqueda: ''
  });
  const [pagina, setPagina] = useState(1);
  const [itemsPorPagina] = useState(10);
  const [empresas, setEmpresas] = useState([]);
  const [empresasFiltradas, setEmpresasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [isLoadingEmpresa, setIsLoadingEmpresa] = useState(false);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await axios.get('/api/empresas');
        // Filtrar solo empresas activas y transformar datos
        const datosTransformados = response.data
          .filter(item => item.activo !== false)
          .map(item => ({
            ...item,
            razonSocial: item.nombre_empresa || 'Sin nombre',
            domicilioFiscal: item.domicilio_fiscal ? 
              `${item.domicilio_fiscal.calle}, ${item.domicilio_fiscal.ciudad}, ${item.domicilio_fiscal.provincia}` : 
              'Sin domicilio',
            telefono: item.datos_contacto?.telefono || 'Sin teléfono',
            email: item.datos_contacto?.mail || 'Sin email'
          }));

        setEmpresas(datosTransformados);
        setEmpresasFiltradas(datosTransformados);
      } catch (err) {
        setError(`Error al cargar datos: ${err.message}`);
        console.error('Error fetching empresas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  const aplicarFiltros = () => {
    const filtered = empresas.filter(empresa => {
      const searchTerm = filtros.busqueda.toLowerCase();
      switch (filtros.criterio) {
        case 'Razón Social':
          return (empresa.razonSocial || '').toLowerCase().includes(searchTerm);
        case 'CUIT':
          return (empresa.cuit || '').toLowerCase().includes(searchTerm);
        case 'Domicilio':
          return (empresa.domicilioFiscal || '').toLowerCase().includes(searchTerm);
        case 'Teléfono':
          return (empresa.telefono || '').toLowerCase().includes(searchTerm);
        default:
          return true;
      }
    });
    setEmpresasFiltradas(filtered);
    setPagina(1);
  };

  const handleOpenPopup = async (type, empresa = null) => {
    setPopupType(type);
    
    if (type === 'modificar-empresa' && empresa?._id) {
      setIsLoadingEmpresa(true);
      try {
        const response = await axios.get(`/api/empresas/${empresa._id}`);
        setSelectedEmpresa({
          _id: response.data._id,
          nombre_empresa: response.data.nombre_empresa || '',
          cuit: response.data.cuit || '',
          datos_contacto: {
            mail: response.data.datos_contacto?.mail || '',
            telefono: response.data.datos_contacto?.telefono || ''
          },
          domicilio_fiscal: {
            calle: calle,
            numero: numero || response.data.domicilio_fiscal?.numero || '',
            ciudad: response.data.domicilio_fiscal?.ciudad || '',
            provincia: response.data.domicilio_fiscal?.provincia || '',
            pais: response.data.domicilio_fiscal?.pais || 'Argentina'
          }
        });
      } catch (error) {
        console.error('Error al cargar datos de la empresa:', error);
        setSelectedEmpresa(empresa);
      } finally {
        setIsLoadingEmpresa(false);
        setPopupOpen(true);
      }
    } else {
      setSelectedEmpresa(empresa);
      setPopupOpen(true);
    }
  };

  const handleAddEmpresa = async (nuevaEmpresa) => {
    try {
      const response = await axios.post('/api/empresas', nuevaEmpresa);
      const newEmpresa = {
        ...response.data,
        razonSocial: response.data.nombre_empresa || 'Sin nombre',
        domicilioFiscal: response.data.domicilio_fiscal ? 
          `${response.data.domicilio_fiscal.calle}, ${response.data.domicilio_fiscal.ciudad}, ${response.data.domicilio_fiscal.provincia}` : 
          'Sin domicilio',
        telefono: response.data.datos_contacto?.telefono || 'Sin teléfono',
        email: response.data.datos_contacto?.mail || 'Sin email'
      };
      setEmpresas(prev => [newEmpresa, ...prev]);
      setEmpresasFiltradas(prev => [newEmpresa, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Error al agregar empresa:', error);
      return { success: false, error: error.message };
    }
  };

  const handleUpdateEmpresa = async (empresaActualizada) => {
    try {
      const response = await axios.put(`/api/empresas/${empresaActualizada._id}`, empresaActualizada);
      const updatedEmpresa = {
        ...response.data,
        razonSocial: response.data.nombre_empresa || 'Sin nombre',
        domicilioFiscal: response.data.domicilio_fiscal ? 
          `${response.data.domicilio_fiscal.calle}, ${response.data.domicilio_fiscal.ciudad}, ${response.data.domicilio_fiscal.provincia}` : 
          'Sin domicilio',
        telefono: response.data.datos_contacto?.telefono || 'Sin teléfono',
        email: response.data.datos_contacto?.mail || 'Sin email'
      };
      setEmpresas(prev => prev.map(e => e._id === empresaActualizada._id ? updatedEmpresa : e));
      setEmpresasFiltradas(prev => prev.map(e => e._id === empresaActualizada._id ? updatedEmpresa : e));
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar empresa:', error);
      return { success: false, error: error.message };
    }
  };

const handleDeleteEmpresa = async (id) => {
  try {
    const { data: currentData } = await axios.get(`/api/empresas/${id}`);

    // Clonar y limpiar los datos
    const { _id, ...empresaSinId } = currentData;

    // Eliminar _id internos si existen
    if (empresaSinId.domicilio_fiscal?._id) {
      delete empresaSinId.domicilio_fiscal._id;
    }
    if (empresaSinId.datos_contacto?._id) {
      delete empresaSinId.datos_contacto._id;
    }

    // Agregar el cambio
    empresaSinId.activo = false;

    await axios.put(`/api/empresas/${id}`, empresaSinId);

    // Actualizar estado local
    setEmpresas(prev => prev.filter(e => e._id !== id));
    setEmpresasFiltradas(prev => prev.filter(e => e._id !== id));

    return { success: true };
  } catch (error) {
    console.error('Error al desactivar empresa:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Error al desactivar la empresa'
    };
  }
};



  const empresasPaginaActual = () => {
    const inicio = (pagina - 1) * itemsPorPagina;
    return empresasFiltradas.slice(inicio, inicio + itemsPorPagina);
  };

  const columns = [
    { 
      id: 'razonSocial',
      label: 'Razón Social',
      minWidth: 200,
      align: 'left'
    },
    { 
      id: 'cuit', 
      label: 'CUIT', 
      minWidth: 120,
      align: 'left'
    },
    {
      id: 'domicilioFiscal',
      label: 'Domicilio Fiscal',
      minWidth: 250,
      align: 'left'
    },
    {
      id: 'telefono',
      label: 'Teléfono',
      minWidth: 120,
      align: 'left'
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 180,
      align: 'left'
    },
    {
      id: 'modificar',
      label: 'Modificar',
      minWidth: 80,
      align: 'center',
      render: (_, row) => (
        <IconButton 
          onClick={() => handleOpenPopup('modificar-empresa', row)}
          size="small"
          color="primary"
          disabled={isLoadingEmpresa}
        >
          {isLoadingEmpresa ? <CircularProgress size={20} /> : <CreateOutlinedIcon fontSize="small"/>}
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
        >
          <CloseOutlinedIcon fontSize="small"/>
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
        selectedItem={selectedEmpresa}
        onSuccess={(data) => {
          if (popupType === 'empresas') {
            handleAddEmpresa(data);
          } else if (popupType === 'modificar-empresa') {
            handleUpdateEmpresa(data);
          }
        }}
        onDelete={popupType === 'confirmar-eliminar' ? handleDeleteEmpresa : null}
      />

      <Box mb={4}>
        <Filtro 
          filtros={filtros} 
          setFiltros={setFiltros} 
          mode="empresas"
          onSearch={aplicarFiltros}
          onClear={() => {
            setFiltros({
              criterio: 'Razón Social',
              busqueda: ''
            });
            setEmpresasFiltradas(empresas);
            setPagina(1);
          }}
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
          data={empresasPaginaActual()}
          sx={{
            tableLayout: 'auto',
            width: '100%',
          }}
        />
      </Box>
            
      <Paginacion
        pagina={pagina}
        setPagina={setPagina}
        totalItems={empresasFiltradas.length}
        itemsPorPagina={itemsPorPagina}
        elemento="empresas"
      />
    </Container>
  );
};

export {ListadoEmpresas};