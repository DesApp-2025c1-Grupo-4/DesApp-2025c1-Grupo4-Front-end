import React, { useState } from 'react';
import { Button, Stack, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Popup from './Popup';

const MenuBotones = ({ items, showBackButton = true, sx = {} }) => {
  const navigate = useNavigate();
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [backLoading, setBackLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('');

  const handleButtonClick = (item, index) => {
    if (item.popup) {
      setPopupType(item.path.replace('/', ''));
      setPopupOpen(true);
    } else {
      setLoadingIndex(index);
      setTimeout(() => navigate(item.path), 200);
    }
  };

  const handleBackClick = () => {
    setBackLoading(true);
    setTimeout(() => { navigate('/'); setBackLoading(false); }, 200);
  };

  return (
    <>
      <Stack 
        spacing={3} 
        className="buttonStack"
        sx={{
          ...sx,
          '& .MuiButton-root': {
            minWidth: '200px'
          }
        }}
      >
        {items.map((item, index) => (
          <Button 
            key={index} 
            fullWidth 
            variant="contained" 
            size="large" 
            onClick={() => handleButtonClick(item, index)} 
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

      <Popup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        page={popupType}
        buttonName={items.find(item => item.path === `/${popupType}`)?.label || ''}
      />
    </>
  );
};

export default MenuBotones;