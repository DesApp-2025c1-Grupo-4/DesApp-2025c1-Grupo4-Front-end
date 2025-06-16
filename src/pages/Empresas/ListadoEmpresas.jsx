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

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await axios.get('/api/empresas');
        
        const datosTransformados = response.data.map(item => ({
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

  // Función para aplicar filtros manualmente
  const aplicarFiltros = () => {
    const filtered = empresas.filter(empresa => {
      if (filtros.busqueda) {
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
      }
      return true;
    });
    setEmpresasFiltradas(filtered);
    setPagina(1);
  };

  const empresasPaginaActual = () => {
    const inicio = (pagina - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    return empresasFiltradas.slice(inicio, fin);
  };

  const handleOpenPopup = async (type, empresa) => {
    setSelectedEmpresa(null);
    
    try {
      // Obtener datos frescos del servidor
      const response = await axios.get(`/api/empresas/${empresa.cuit}`);
      setSelectedEmpresa(response.data);
    } catch (error) {
      console.error('Error al obtener empresa:', error);
      setSelectedEmpresa(empresa);
    }
    
    setPopupType(type);
    await new Promise(resolve => setTimeout(resolve, 10)); // Pequeño delay
    setPopupOpen(true);
  };

  const handleDeleteEmpresa = async (cuit) => {
    try {
      await axios.patch(`/api/empresas/${cuit}/delete`);
      setEmpresas(prev => prev.filter(e => e.cuit !== cuit));
      setEmpresasFiltradas(prev => prev.filter(e => e.cuit !== cuit));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar empresa:', error);
      return { success: false, error: error.message };
    }
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
        >
          <CreateOutlinedIcon fontSize="small"/>
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
        onDelete={popupType === 'confirmar-eliminar' ? handleDeleteEmpresa : null}
        buttonName={
          popupType === 'modificar-empresa' ? 'Modificar Empresa' : 
          popupType === 'confirmar-eliminar' ? 'Eliminar Empresa' : 
          'Aceptar'
        }
        message={popupType === 'confirmar-eliminar' ? '¿Está seguro que desea eliminar esta empresa?' : ''}
      />

      <Box mb={4}>
        <Filtro 
          filtros={filtros} 
          setFiltros={setFiltros} 
          mode="empresas"
          onSearch={aplicarFiltros}  // Pasar la función de búsqueda
          onClear={() => {
            setFiltros({
              criterio: 'Razón Social',
              busqueda: ''
            });
            setEmpresasFiltradas(empresas);  // Restablecer a todas las empresas
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