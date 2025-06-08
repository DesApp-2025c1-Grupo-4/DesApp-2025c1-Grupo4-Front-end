import React from 'react';
import { Container } from '@mui/material';
import MenuBotones from '../../commonComponents/MenuBotones';

const RegistroViajes = () => {
  const menuItems = [
    { label: 'Registrar Viaje', path: '/registrar-viaje' },
    { label: 'Modificar Viaje', path: '/modificar-viaje' },
    { label: 'Seguimiento', path: '/seguimiento' },
    { label: 'Listado de viajes', path: '/listado-viajes' }
  ];

  return (
    <>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <MenuBotones items={menuItems} />
      </Container>
    
    </>
  );
};

export default RegistroViajes;