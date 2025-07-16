import { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Alert, IconButton } from '@mui/material';
import Filtro from '../../commonComponents/Filtro';
import Tabla2 from '../../commonComponents/Tabla2';
import Paginacion from '../../commonComponents/Paginacion';
import Popup from '../../commonComponents/Popup';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';
import { getActiveChoferes,getChoferById,createChofer,updateChofer,deleteChofer} from '../../services/Choferes/ChoferService';
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

  const fetchChoferes = async () => {
    try {
      setLoading(true);
      const response = await getActiveChoferes();

      const datosTransformados = response
        .filter(item => item.activo !== false)
        .map(item => ({
          ...item,
          _id: item._id,
          nombre: item.nombre || '',
          apellido: item.apellido || '',
          cuil: item.cuil || '',
          fechaNacimiento: item.fecha_nacimiento 
            ? format(new Date(item.fecha_nacimiento), 'dd/MM/yyyy')
            : '',
          empresa: item.empresa?.nombre_empresa || '',
          vehiculoAsignado: item.vehiculo_defecto 
            ? `${item.vehiculo_defecto.patente}` 
            : 'Sin vehículo',
          fechaNacimientoObj: item.fecha_nacimiento ? new Date(item.fecha_nacimiento) : null,
          empresaObj: item.empresa || null,
          vehiculoObj: item.vehiculo_defecto || null,
          licencia: item.licencia ? {
            ...item.licencia,
            fecha_expiracion: item.licencia.fecha_expiracion,
            fechaExpiracionFormatted: item.licencia.fecha_expiracion || '',
            fechaExpiracionObj: item.licencia.fecha_expiracion 
              ? parseDateFromDDMMYYYY(item.licencia.fecha_expiracion)
              : null,
            documento: item.licencia.documento ? {
              ...item.licencia.documento,
              data: item.licencia.documento.data
            } : null
          } : null
        }));

      setChoferes(datosTransformados);
      setChoferesFiltrados(datosTransformados);
      setError(null);
    } catch (err) {
      setError(`Error al cargar datos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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

  const parseDateFromDDMMYYYY = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  const limpiarFiltros = () => {
    setFiltros({ criterio: 'CUIL', busqueda: '' });
    setFiltrosAplicados({ criterio: 'CUIL', busqueda: '' });
  };

  const choferesPaginaActual = () => {
    const inicio = (pagina - 1) * itemsPorPagina;
    return choferesFiltrados.slice(inicio, inicio + itemsPorPagina);
  };

const handleOpenPopup = async (type, chofer = null) => {
  setPopupType(type);
  
  if (type === 'confirmar-eliminar' && chofer) {
    setSelectedChofer({ 
      _id: chofer._id,
      nombre: chofer.nombre
    });
    setPopupOpen(true);
    return;
  }

  if (type === 'modificar-chofer') {
    const newChoferTemplate = {
      nombre: '',
      apellido: '',
      cuil: '',
      fechaNacimiento: null,
      empresa: null,
      vehiculoAsignado: null,
      licenciaNumero: '',
      licenciaTipo: [],
      licenciaExpiracion: null,
      licenciaDocumento: null
    };

    if (chofer) {
      try {
        const choferData = await getChoferById(chofer._id);

        const licenciaDocumento = choferData.licencia?.documento 
        
          ? {
              ...choferData.licencia.documento,
              data: choferData.licencia.documento.data || { type: 'Buffer', data: [] }
            }
          : null;
        const vehiculoAsignado = choferData.vehiculo_defecto 
          ? {
              _id: choferData.vehiculo_defecto._id || choferData.vehiculo_defecto,
              patente: choferData.vehiculo_defecto.patente || ''
            }
          : null;

        setSelectedChofer({
          ...newChoferTemplate,
          ...choferData,
          _id: choferData._id,
          nombre: choferData.nombre || '',
          apellido: choferData.apellido || '',
          cuil: choferData.cuil || '',
          fechaNacimiento: choferData.fecha_nacimiento ? new Date(choferData.fecha_nacimiento) : null,
          empresa: choferData.empresa ? {
            _id: typeof choferData.empresa === 'object' ? choferData.empresa._id : choferData.empresa,
            nombre_empresa: typeof choferData.empresa === 'object' ? choferData.empresa.nombre_empresa : ''
          } : null,
          vehiculoAsignado: vehiculoAsignado,
          licenciaNumero: choferData.licencia?.numero || '',
          licenciaTipo: choferData.licencia?.tipos || [],
          licenciaExpiracion: choferData.licencia?.fecha_expiracion ? 
            new Date(choferData.licencia.fecha_expiracion.split('/').reverse().join('-')) : null,
          licenciaDocumento: licenciaDocumento
        });
      } catch (error) {
        console.error('Error al cargar detalles del chofer:', error);
        setSelectedChofer({
          ...newChoferTemplate,
          ...chofer,
          empresa: chofer.empresaObj ? {
            _id: chofer.empresaObj._id,
            nombre_empresa: chofer.empresaObj.nombre_empresa
          } : null,
          vehiculoAsignado: chofer.vehiculoObj ? {
            _id: chofer.vehiculoObj._id,
            patente: chofer.vehiculoObj.patente
          } : null
        });
      }
    } else {
      setSelectedChofer(newChoferTemplate);
    }
    setPopupOpen(true);
  }
};

  const handleDeleteChofer = async (id) => {
    try {
      await deleteChofer(id);
      setChoferes(prev => prev.filter(c => c._id !== id));
      setChoferesFiltrados(prev => prev.filter(c => c._id !== id));
      setPopupOpen(false);
      return { success: true };
    } catch (error) {
      return { 
        success: false,
        error: error.response?.data?.message || 'Error al eliminar chofer'
      };
    }
  };

 const handleSubmitChofer = async (formData) => {
  try {
    const choferData = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      cuil: formData.cuil,
      fecha_nacimiento: formData.fechaNacimiento,
      empresa: formData.empresa?._id || formData.empresa,
      vehiculo_defecto: formData.vehiculoAsignadoData?._id || formData.vehiculoAsignado,
      licencia: {
        numero: formData.licenciaNumero || "",
        tipos: formData.licenciaTipo || [],
        fecha_expiracion: formData.licenciaExpiracion 
          ? format(formData.licenciaExpiracion, 'dd/MM/yyyy') 
          : null,
        documento: formData.licenciaDocumento || {
          data: { type: 'Buffer', data: [] },
          contentType: "application/pdf",
          fileName: "licencia.pdf",
          size: 0
        }
      }
    };

    let response;
    if (selectedChofer?._id) {
      response = await updateChofer(selectedChofer._id, choferData);
    } else {
      response = await createChofer(choferData);
    }

    fetchChoferes();
    return { success: true, data: response };
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Error al guardar el chofer'
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
      id: 'documento',
      label: 'Licencia',
      minWidth: 100,
      align: 'center',
      render: (_, row) => (
        row.licencia?.documento ? (
          <IconButton 
            onClick={() => {
              const byteArray = new Uint8Array(row.licencia.documento.data.data);
              const blob = new Blob([byteArray], { type: row.licencia.documento.contentType });
              const url = URL.createObjectURL(blob);
              window.open(url, '_blank');
            }}
            color="primary"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        ) : null
      )
    },
    {
      id: 'modificar',
      label: 'Modificar',
      minWidth: 80,
      align: 'center',
      render: (_, row) => (
        <IconButton 
          onClick={() => handleOpenPopup('modificar-chofer', row)} 
          size="small" 
          color="primary"
          variant="tableButtons"
        >
          <CreateOutlinedIcon fontSize="small" variant="tableButtons" />
        </IconButton>
      )
    },
    {
      id: 'eliminar',
      label: 'Eliminar',
      render: (_, row) => (
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleOpenPopup('confirmar-eliminar', { 
              _id: row._id, 
              nombre: row.nombre 
            });
          }}
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
        selectedItem={selectedChofer}
        onDelete={popupType === 'confirmar-eliminar' ? 
          async () => {
            const result = await handleDeleteChofer(selectedChofer._id);
            if (!result.success) {
              alert(result.error);
            }
          }
          : null
        }
        onSubmit={popupType === 'modificar-chofer' ? handleSubmitChofer : null}
        buttonName={
          popupType === 'modificar-chofer'
            ? selectedChofer?._id ? 'Modificar Chofer' : 'Crear Chofer'
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
        <Tabla2 
          columns={columns} 
          data={choferesPaginaActual()} 
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
        totalItems={choferesFiltrados.length}
        itemsPorPagina={itemsPorPagina}
        elemento="choferes"
      />
    </Container>
  );
};

export { ListadoChoferes };