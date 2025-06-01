import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Filtro from '../../components/Filtro.jsx';
import Buscador from '../../components/Buscador.jsx';
import Tabla from '../../components/Tabla.jsx';
import Paginacion from '../../components/Paginacion.jsx';

const ListadoDeViajes = () => {
  const [filtros, setFiltros] = useState({
    tipo: '',
    fechaDesde: '',
    fechaHasta: '',
    origen: '',
    destino: ''
  });
  
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);

  // Datos de ejemplo (reemplazarlos con los datos reales)
  const viajes = [
    { numero: 'P.V.124', transporte: 'Transporte Sur', conductor: 'M. López', patente: 'DEF456', fecha: '20/08/2025', tipo: 'Internacional', origen: 'Monóxza', destino: 'Santiago' },
    { numero: 'P.V.124', transporte: 'Transporte Sur', conductor: 'M. López', patente: 'DEF456', fecha: '20/08/2025', tipo: 'Internacional', origen: 'Monóxza', destino: 'Santiago' },
    { numero: 'P.V.124', transporte: 'Transporte Sur', conductor: 'M. López', patente: 'DEF456', fecha: '20/08/2025', tipo: 'Internacional', origen: 'Monóxza', destino: 'Santiago' },
    { numero: 'P.V.124', transporte: 'Transporte Sur', conductor: 'M. López', patente: 'DEF456', fecha: '20/08/2025', tipo: 'Internacional', origen: 'Monóxza', destino: 'Santiago' },
    // ... otros viajes
  ];

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={4}>
          <Filtro filtros={filtros} setFiltros={setFiltros} />
        </Box>
        
        <Box mb={4}>
          <Buscador busqueda={busqueda} setBusqueda={setBusqueda} />
        </Box>
        
        <Box mb={4}>
          <Tabla viajes={viajes} />
        </Box>
        
        <Paginacion
          pagina={pagina} 
          setPagina={setPagina} 
          totalItems={viajes.length} 
        />
      </Container>
    </>
  );
};

export default ListadoDeViajes;