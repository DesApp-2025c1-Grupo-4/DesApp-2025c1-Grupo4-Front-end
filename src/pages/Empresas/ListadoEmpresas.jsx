import { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import Tabla2 from '../../commonComponents/Tabla2';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { getAllEmpresas } from '../../services/Empresas/EmpresaService';
import Paginacion from '../../commonComponents/Paginacion';
import Filtro from '../../commonComponents/Filtro';
import Popup from '../../commonComponents/Popup';

export function ListadoEmpresas(){
  // Table state
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('name');
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 10;

  // Popup state
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [isDataReady, setIsDataReady] = useState(false);

  // Content state
  const [empresas, setEmpresas] = useState([]);
  const [empresasFiltradas, setEmpresasFiltradas] = useState([]);

  // Filtro state
  const [filtros, setFiltros] = useState({
    criterio: '',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: '',
  });
  
  // API Call
  useEffect(() => {
    async function fetchEmpresas() {
      try {
        const empresas = await getAllEmpresas();
        setEmpresas(empresas);
        setEmpresasFiltradas(empresas);
      } catch (error) {
        console.log('ERROR FETCH API [empresas]: ' + error);
      }
    }
    fetchEmpresas();
  }, []);
  
  // Función de búsqueda
  const handleSearch = () => {
    if (!filtros.busqueda) {
      setEmpresasFiltradas(empresas);
      return;
    }

    const resultados = empresas.filter(empresa => {
      const cuitNormalizado = empresa.cuit?.replace(/[- ]/g, '').toLowerCase() || '';
      const busquedaNormalizada = filtros.busqueda.replace(/[- ]/g, '').toLowerCase();
      return cuitNormalizado.includes(busquedaNormalizada);
    });

    setEmpresasFiltradas(resultados);
    setPagina(1);
  };

  // Función para limpiar filtros
  const handleClear = () => {
    setEmpresasFiltradas(empresas);
    setPagina(1);
  };

  // Handle popup open - CORREGIDO
  const handleOpenPopup = async (type, empresa = null) => {
    setSelectedEmpresa(empresa);
    setPopupType(type);
    setIsDataReady(false);
    
    // Pequeño delay para asegurar que el estado se actualizó
    await new Promise(resolve => setTimeout(resolve, 50));
    setIsDataReady(true);
    setPopupOpen(true);
  };

  // Adding icons
  let listaCompleta = empresasFiltradas.map(empresa => {
    return {
      ...empresa,
      modificar: (
        <IconButton 
          onClick={() => handleOpenPopup('modificar-empresa', empresa)}
          size="small"
        >
          <CreateOutlinedIcon fontSize="small"/>
        </IconButton>
      ),
      eliminar: (
        <IconButton 
          onClick={() => handleOpenPopup('confirmar-eliminar', empresa)}
          size="small"
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <CloseOutlinedIcon fontSize="small"/>
        </IconButton>
      )
    };
  });

  // Parametros para paginado
  const PaginaActual = (pagina) => {
    return listaCompleta.slice(
      (pagina - 1) * itemsPorPagina,
      pagina * itemsPorPagina
    );
  };

  // Columns configuration
  const columns = [
    { 
      id: 'razonSocial', 
      label: 'Razón Social', 
      sortable: false,
      minWidth: 80 
    },
    { 
      id: 'cuit', 
      label: 'CUIT/RUT', 
      sortable: false,
      minWidth: 80
    },
    {
      id: 'domicilioFiscal',
      label: 'Domicilio Fiscal',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'telefono',
      label: 'Teléfono',
      sortable: false,
      minWidth: 80
    },
    {
      id: 'modificar',
      label: 'Modificar',
      sortable: false,
      width: '5%'
    },
    {
      id: 'eliminar',
      label: 'Eliminar',
      sortable: false,
      width: '5%'
    }
  ];

  // Sort handler
  const handleSort = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  return (
    <>
      <Box sx={{py:4, px:15}}>
        <Box mb={4}>
          <Filtro 
            filtros={filtros} 
            setFiltros={setFiltros} 
            mode={'empresas'}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </Box>
        <Tabla2
          mb={4}
          columns={columns}
          data={PaginaActual(pagina)}
          sortDirection={sortDirection}
          sortBy={sortBy}
          onSort={handleSort}
        />
        <Paginacion
          pagina={pagina}
          setPagina={setPagina}
          totalItems={listaCompleta.length}
          itemsPorPagina={itemsPorPagina}
          elemento="empresas"
        />
      </Box>

      {isDataReady && (
        <Popup
          open={popupOpen}
          onClose={() => setPopupOpen(false)}
          page={popupType}
          selectedItem={selectedEmpresa}
          buttonName={
            popupType === 'modificar-empresa' ? 'Modificar Empresa' :
            popupType === 'confirmar-eliminar' ? 'Eliminar Empresa' :
            'Aceptar'
          }
        />
      )}
    </>
  );
};