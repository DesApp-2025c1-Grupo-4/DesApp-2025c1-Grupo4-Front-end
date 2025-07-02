import { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Alert, IconButton } from '@mui/material';
import Filtro from '../../commonComponents/Filtro';
import Tabla2 from '../../commonComponents/Tabla2';
import Paginacion from '../../commonComponents/Paginacion';
import Popup from '../../commonComponents/Popup';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { dateFormat } from '../../helpers/dateFormat';
import ChoferForm from '../../commonComponents/forms/ChoferForm';
import { format } from 'date-fns';

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
    const response = await axios.get('/api/choferes?activo=true');

    const datosTransformados = response.data
      .filter(item => item.activo !== false)
      .map(item => ({
        ...item,
        _id: item._id,
        nombre: item.nombre || '',
        apellido: item.apellido || '',
        cuil: item.cuil || '',
        // Formatear fechas para mostrar en la tabla
        fechaNacimiento: item.fecha_nacimiento 
          ? format(new Date(item.fecha_nacimiento), 'dd/MM/yyyy')
          : '',
        empresa: item.empresa?.nombre_empresa || '',
        vehiculoAsignado: item.vehiculo_defecto 
          ? `${item.vehiculo_defecto.patente}` 
          : 'Sin vehículo',
        // Mantener los objetos Date para el formulario
        fechaNacimientoObj: item.fecha_nacimiento ? new Date(item.fecha_nacimiento) : null,
        empresaObj: item.empresa || null,
        vehiculoObj: item.vehiculo_defecto || null,
        licencia: item.licencia ? {
          ...item.licencia,
          fecha_expiracion: item.licencia.fecha_expiracion,
          // Formatear fecha de expiración para mostrar
          fechaExpiracionFormatted: item.licencia.fecha_expiracion || '',
          // Mantener objeto Date para el formulario
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
        const response = await axios.get(`/api/choferes/${chofer._id}`);
        const choferData = response.data;

        // Asegurar que los datos de la licencia se carguen correctamente
        const licenciaDocumento = choferData.licencia?.documento 
          ? {
              ...choferData.licencia.documento,
              data: choferData.licencia.documento.data || { type: 'Buffer', data: [] }
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
          vehiculoAsignado: choferData.vehiculo_defecto ? {
            _id: typeof choferData.vehiculo_defecto === 'object' ? choferData.vehiculo_defecto._id : choferData.vehiculo_defecto,
            patente: typeof choferData.vehiculo_defecto === 'object' ? choferData.vehiculo_defecto.patente : ''
          } : null,
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
      await axios.patch(`/api/choferes/${id}/delete`);
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
    console.log("Datos del formulario:", formData); // Para depuración

    const response = await axios({
      method: selectedChofer?._id ? 'PUT' : 'POST',
      url: selectedChofer?._id 
        ? `/api/choferes/${selectedChofer._id}` 
        : '/api/choferes',
      data: {
        ...formData,
        licencia: {
          numero: formData.licenciaNumero || "",
          tipos: formData.licenciaTipo || [],
          fecha_expiracion: formData.licenciaExpiracion 
            ? format(formData.licenciaExpiracion, 'dd/MM/yyyy') 
            : null,
          documento: formData.licenciaDocumento || {
            data: {
              type: 'Buffer',
              data: []
            },
            contentType: "application/pdf",
            fileName: "licencia.pdf",
            size: 0
          }
        }
      }
    });

    fetchChoferes();
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error detallado:", error.response?.data || error.message);
    
    let errorMessage = "Error al guardar el chofer";
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    return { 
      success: false, 
      error: errorMessage,
      details: error.response?.data?.details 
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
              // Crear Blob desde los datos del buffer
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
        <IconButton onClick={() => handleOpenPopup('modificar-chofer', row)} size="small" color="primary">
          <CreateOutlinedIcon fontSize="small" />
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