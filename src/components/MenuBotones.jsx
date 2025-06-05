import React, { useState } from 'react';
import { Button, Stack, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MenuBotones = ({ items, showBackButton = true }) => {
  const navigate = useNavigate();
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [backLoading, setBackLoading] = useState(false);

  const handleButtonClick = (path, index) => {
    setLoadingIndex(index);
    setTimeout(() => navigate(path), 200);
  };

  const handleBackClick = () => {
    setBackLoading(true);
    setTimeout(() => { navigate('/'); setBackLoading(false); }, 200);
  };

  return (
    <Stack spacing={3} className="buttonStack">
      {items.map((item, index) => (
        <Button 
          key={index} 
          fullWidth 
          variant="contained" 
          size="large" 
          onClick={() => handleButtonClick(item.path, index)} 
          disabled={loadingIndex === index}
          color={loadingIndex === index ? 'secondary' : 'primary'}
        >
          {loadingIndex === index ? (
            <>
              <CircularProgress size={30} color="inherit" /> 
              Redirigiendo...
            </>
          ) : (
            item.label
          )}
        </Button>
      ))}
      {showBackButton && (
        <Button 
          variant="outlined" 
          size="large" 
          onClick={handleBackClick} 
          disabled={backLoading}
        >
          {backLoading ? (
            <>
              <CircularProgress size={30} color="inherit" /> 
              Volviendo...
            </>
          ) : (
            'ATRÁS'
          )}
        </Button>
      )}
    </Stack>
  );
};

export default MenuBotones;