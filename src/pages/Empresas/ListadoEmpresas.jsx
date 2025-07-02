import { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Alert, IconButton } from '@mui/material';
import Filtro from '../../commonComponents/Filtro';
import Tabla2 from '../../commonComponents/Tabla2';
import Paginacion from '../../commonComponents/Paginacion';
import Popup from '../../commonComponents/Popup';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { getActiveEmpresas,getEmpresaById,createEmpresa,updateEmpresa,deleteEmpresa } from '../../services/Empresas/EmpresaService';

const ListadoEmpresas = () => {
  const [filtros, setFiltros] = useState({ criterio: 'Razón Social', busqueda: '' });
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
        const res = await getActiveEmpresas();
        const datos = res.filter(e => e.activo !== false).map(e => ({
          ...e,
          razonSocial: e.nombre_empresa || 'Sin nombre',
          domicilioFiscal: e.domicilio_fiscal 
            ? `${e.domicilio_fiscal.direccion || ''}, ${e.domicilio_fiscal.ciudad || ''}, ${e.domicilio_fiscal.provincia_estado || ''}, ${e.domicilio_fiscal.pais || ''}`
                .replace(/, ,/g, ', ')  
                .replace(/, $/, '')     
                .trim() || 'Sin domicilio'
            : 'Sin domicilio',
          telefono: e.datos_contacto?.telefono || 'Sin teléfono',
          email: e.datos_contacto?.mail || 'Sin email'
        }));
        setEmpresas(datos);
        setEmpresasFiltradas(datos);
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
    const searchTerm = filtros.busqueda.toLowerCase();
    const filtered = empresas.filter(e => {
      const campo = {
        'Razón Social': e.razonSocial,
        'CUIT': e.cuit,
        'Domicilio': e.domicilioFiscal,
        'Teléfono': e.telefono
      }[filtros.criterio] || '';
      return (campo || '').toLowerCase().includes(searchTerm);
    });
    setEmpresasFiltradas(filtered);
    setPagina(1);
  };

  const handleOpenPopup = async (type, empresa = null) => {
    setPopupType(type);
    if (type === 'modificar-empresa' && empresa?._id) {
      setIsLoadingEmpresa(true);
      try {
        const res = await getEmpresaById(empresa._id);
        setSelectedEmpresa({
          _id: res._id,
          nombre_empresa: res.nombre_empresa || '',
          cuit: res.cuit || '',
          datos_contacto: {
            mail: res.datos_contacto?.mail || '',
            telefono: res.datos_contacto?.telefono || ''
          },
          domicilio_fiscal: {
            direccion: res.domicilio_fiscal?.direccion || '',
            ciudad: res.domicilio_fiscal?.ciudad || '',
            provincia_estado: res.domicilio_fiscal?.provincia_estado || '',
            pais: res.domicilio_fiscal?.pais || '',
          }
        });
      } catch (err) {
        console.error('Error al cargar datos:', err);
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

  const handleAddEmpresa = async (empresa) => {
    try {
      const res = await createEmpresa(empresa);
      const nueva = {
        ...res,
        razonSocial: res.nombre_empresa || 'Sin nombre',
        domicilioFiscal: res.domicilio_fiscal 
          ? `${res.domicilio_fiscal.direccion}, ${res.domicilio_fiscal.ciudad}, ${res.domicilio_fiscal.provincia_estado}` 
          : 'Sin domicilio',
        telefono: res.datos_contacto?.telefono || 'Sin teléfono',
        email: res.datos_contacto?.mail || 'Sin email'
      };
      setEmpresas(p => [nueva, ...p]);
      setEmpresasFiltradas(p => [nueva, ...p]);
      return { success: true };
    } catch (err) {
      console.error('Error al agregar empresa:', err);
      return { success: false, error: err.message };
    }
  };

  const handleUpdateEmpresa = async (empresa) => {
    try {
      const res = await updateEmpresa(empresa._id, empresa);
      const actualizada = {
        ...res,
        razonSocial: res.nombre_empresa || 'Sin nombre',
        domicilioFiscal: res.domicilio_fiscal 
          ? `${res.domicilio_fiscal.direccion}, ${res.domicilio_fiscal.ciudad}, ${res.domicilio_fiscal.provincia_estado}` 
          : 'Sin domicilio',
        telefono: res.datos_contacto?.telefono || 'Sin teléfono',
        email: res.datos_contacto?.mail || 'Sin email'
      };
      setEmpresas(p => p.map(e => e._id === empresa._id ? actualizada : e));
      setEmpresasFiltradas(p => p.map(e => e._id === empresa._id ? actualizada : e));
      return { success: true };
    } catch (err) {
      console.error('Error al actualizar empresa:', err);
      return { success: false, error: err.message };
    }
  };

  const handleDeleteEmpresa = async (id) => {
    try {
      await deleteEmpresa(id);
      setEmpresas(p => p.filter(e => e._id !== id));
      setEmpresasFiltradas(p => p.filter(e => e._id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error al desactivar empresa:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Error al desactivar la empresa' 
      };
    }
  };

  const empresasPaginaActual = () => empresasFiltradas.slice(
    (pagina - 1) * itemsPorPagina, 
    pagina * itemsPorPagina
  );

  const columns = [
    { id: 'razonSocial', label: 'Razón Social', minWidth: 200, align: 'left' },
    { id: 'cuit', label: 'CUIT', minWidth: 120, align: 'left' },
    { id: 'domicilioFiscal', label: 'Domicilio Fiscal', minWidth: 250, align: 'left' },
    { id: 'telefono', label: 'Teléfono', minWidth: 120, align: 'left' },
    { id: 'email', label: 'Email', minWidth: 180, align: 'left' },
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
          variant="tableButtons"
          disabled={isLoadingEmpresa}
        >
          {isLoadingEmpresa ? <CircularProgress size={20} /> : <CreateOutlinedIcon fontSize="small" variant="tableButtons" />}
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
        selectedItem={selectedEmpresa}
        onSuccess={data => popupType === 'empresas' 
          ? handleAddEmpresa(data) 
          : handleUpdateEmpresa(data)}
        onDelete={popupType === 'confirmar-eliminar' 
          ? handleDeleteEmpresa 
          : null}
      />
      <Box mb={4}>
        <Filtro
          filtros={filtros}
          setFiltros={setFiltros}
          mode="empresas"
          onSearch={aplicarFiltros}
          onClear={() => {
            setFiltros({ criterio: 'Razón Social', busqueda: '' });
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
        totalItems={empresasFiltradas.length}
        itemsPorPagina={itemsPorPagina}
        elemento="empresas"
      />
    </Container>
  );
};

export { ListadoEmpresas };