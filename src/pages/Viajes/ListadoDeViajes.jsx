import React, { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Alert } from '@mui/material';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Filtro from '../../components/Filtro';
import Buscador from '../../components/Buscador';
import Tabla from '../../components/Tabla';
import Paginacion from '../../components/Paginacion';
import { getViajes } from '../../services/ViajeServices';

const ListadoDeViajes = () => {
  const [filtros, setFiltros] = useState({
    criterio: '',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: ''
  });
  const [pagina, setPagina] = useState(1);
  const [viajes, setViajes] = useState([]);
  const [viajesFiltrados, setViajesFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener datos del backend
  useEffect(() => {
    const fetchViajes = async () => {
      try {
        setLoading(true);
        const data = await getViajes({});
        setViajes(data);
        setViajesFiltrados(data);
      } catch (err) {
        setError('Error al cargar viajes. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchViajes();
  }, []);

  // Aplicar filtros localmente
  useEffect(() => {
    if (viajes.length > 0) {
      const resultados = viajes.filter(viaje => {
        // Filtro por fechas
        if (filtros.fechaDesde && new Date(viaje.inicioViaje) < new Date(filtros.fechaDesde)) return false;
        if (filtros.fechaHasta && new Date(viaje.inicioViaje) > new Date(filtros.fechaHasta)) return false;
        
        // Filtro por búsqueda
        if (filtros.busqueda) {
          const term = filtros.busqueda.toLowerCase();
          return (
            viaje._id.toString().includes(term) ||
            (viaje.asignacion?.toString() || '').includes(term) ||
            (viaje.estado || '').toLowerCase().includes(term)
          );
        }
        
        return true;
      });
      setViajesFiltrados(resultados);
      setPagina(1); // Resetear a primera página al cambiar filtros
    }
  }, [filtros, viajes]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={4}>
          <Filtro filtros={filtros} setFiltros={setFiltros} />
        </Box>
        
        <Box mb={4}>
          <Buscador 
            busqueda={filtros.busqueda} 
            setBusqueda={(value) => setFiltros({...filtros, busqueda: value})} 
          />
        </Box>
        
        <Box mb={4}>
          <Tabla viajes={viajesFiltrados} />
        </Box>
        
        <Paginacion
          pagina={pagina}
          setPagina={setPagina}
          totalItems={viajesFiltrados.length}
        />
      </Container>
      <Footer />
    </>
  );
};

export default ListadoDeViajes;