import React, { useState } from 'react';
import { Box, Container, CircularProgress, Alert } from '@mui/material';
import Header from '../../components/Header';
import Filtro from '../../components/Filtro';
import Tabla from '../../components/Tabla';
import Paginacion from '../../components/Paginacion';
import { useViajesData } from '../../hooks/useViajesData';
import { useViajesFiltrados } from '../../hooks/useViajesFiltrados';

const ListadoDeViajes = () => {
  const [filtros, setFiltros] = useState({
    criterio: '',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: ''
  });
  const [pagina, setPagina] = useState(1);
  
  const { viajes, loading, error } = useViajesData();
  const { viajesFiltrados, viajesPaginaActual, itemsPorPagina } = useViajesFiltrados(viajes, filtros);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={4}>
          <Filtro filtros={filtros} setFiltros={setFiltros} />
        </Box>
        
        <Box mb={4}>
          <Tabla data={viajesPaginaActual(pagina)} />
        </Box>
        
        <Paginacion
          pagina={pagina}
          setPagina={setPagina}
          totalItems={viajesFiltrados.length}
          itemsPorPagina={itemsPorPagina}
        />
      </Container>
    </>
  );
};

export default ListadoDeViajes;