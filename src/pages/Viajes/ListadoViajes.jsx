import { useState } from 'react';
import { Box, Container, CircularProgress, Alert, Stack, Button } from '@mui/material';
import Filtro from '../../commonComponents/Filtro';
import Tabla from '../../commonComponents/Tabla';
import Paginacion from '../../commonComponents/Paginacion';
import { useViajesData } from '../../hooks/useViajesData';
import { useViajesFiltrados } from '../../hooks/useViajesFiltrados';
import Popup from '../../commonComponents/Popup';

const ListadoDeViajes = () => {
  const [filtros, setFiltros] = useState({
    criterio: '',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: ''
  });
  const [pagina, setPagina] = useState(1);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('');
  
  const { viajes, loading, error } = useViajesData();
  const { viajesFiltrados, viajesPaginaActual, itemsPorPagina } = useViajesFiltrados(viajes, filtros);

  const handleOpenPopup = (type) => {
    setPopupType(type);
    setPopupOpen(true);
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Botones horizontales */}
      <Stack direction="row" spacing={16} sx={{ mb: 4 }}>
        <Button 
          variant="contained" 
          onClick={() => handleOpenPopup('registrar-viaje')}
          sx={{ minWidth: 300 }}  
        >
          Registrar Viaje
        </Button>
        <Button 
          variant="contained" 
          onClick={() => handleOpenPopup('modificar-viaje')}
          sx={{ minWidth: 300 }} 
        >
          Modificar Viaje
        </Button>
        <Button 
          variant="contained" 
          onClick={() => handleOpenPopup('seguimiento')}
          sx={{ minWidth: 300 }}  
        >
          Seguimiento
        </Button>
      </Stack>

      {/* Popup */}
      <Popup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        page={popupType}
        buttonName={
          popupType === 'registrar-viaje' ? 'Registrar Viaje' :
          popupType === 'modificar-viaje' ? 'Modificar Viaje' :
          'Seguimiento'
        }
      />

      {/* Contenido existente del listado */}
      <Box mb={4}>
        <Filtro filtros={filtros} setFiltros={setFiltros} mode={"viajes"}/>
      </Box>
      
      <Box mb={4}>
        <Tabla data={viajesPaginaActual(pagina)} />
      </Box>
      
      <Paginacion
        pagina={pagina}
        setPagina={setPagina}
        totalItems={viajesFiltrados.length}
        itemsPorPagina={itemsPorPagina}
        elemento="viajes"
      />
    </Container>
  );
};

export default ListadoDeViajes;