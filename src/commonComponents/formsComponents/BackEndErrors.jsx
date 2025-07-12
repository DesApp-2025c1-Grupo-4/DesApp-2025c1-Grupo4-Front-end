import { Alert, AlertTitle, Collapse, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';

const BackendErrors = ({ errors, onClose }) => {
  const [open, setOpen] = useState(true);

  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  // Función para extraer todos los mensajes de error en un array
  const getAllErrorMessages = () => {
    const messages = [];
    
    // Manejar error general
    if (errors._general || errors.message || errors.error) {
      messages.push(errors._general || errors.message || errors.error);
    }
    
    // Manejar detalles de error (objeto o array)
    if (errors._details) {
      if (Array.isArray(errors._details)) {
        messages.push(...errors._details);
      } else if (typeof errors._details === 'object') {
        messages.push(...Object.values(errors._details));
      }
    }
    
    // Manejar errores de validación de campos
    if (errors.errors) {
      if (Array.isArray(errors.errors)) {
        messages.push(...errors.errors);
      } else if (typeof errors.errors === 'object') {
        messages.push(...Object.values(errors.errors));
      }
    }
    
    // Manejar otros formatos de error no estándar
    Object.keys(errors).forEach(key => {
      if (key !== '_general' && key !== '_details' && key !== 'message' && key !== 'error' && key !== 'errors') {
        if (typeof errors[key] === 'string') {
          messages.push(errors[key]);
        } else if (Array.isArray(errors[key])) {
          messages.push(...errors[key]);
        }
      }
    });

    return messages.filter(msg => msg); // Filtrar mensajes vacíos
  };

  const errorMessages = getAllErrorMessages();

  return (
    <Collapse in={open}>
      <Alert 
        severity="error"
        sx={{ mb: 3 }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <Close fontSize="inherit" />
          </IconButton>
        }
      >
        <AlertTitle>Error encontrado</AlertTitle>
        
        {errorMessages.length > 0 && (
          <List dense sx={{ py: 0 }}>
            {errorMessages.map((message, index) => (
              <ListItem key={index} sx={{ py: 0 }}>
                <ListItemText
                  primary={`• ${message}`}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Alert>
    </Collapse>
  );
};

export default BackendErrors;