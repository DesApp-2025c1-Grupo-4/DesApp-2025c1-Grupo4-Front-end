import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
  InputLabel 
} from '@mui/material';
import { grey } from "@mui/material/colors";
import { ROUTE_CONFIG } from '../config/routesConfig';

const Popup  = ({
  buttonName,
  page
}) => {

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    razonSocial: '',
    cuit: '',
    domicilio: '',
    telefono: ''
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    setOpen(false);
  };

  const currentPage = ROUTE_CONFIG[`/${page}`]

  return (
    <>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleOpen}
      >
        {buttonName}
      </Button>
    
    
      <Dialog open={open} onClose={handleClose} fullWidth sx={{backgroundColor: grey[50]}}>
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', px: 2}}>
            {currentPage.logo}
            <DialogTitle color="primary" fontWeight={'bold'}>
                {currentPage.newButton}
            </DialogTitle>
         </Box>
        <Box sx={{backgroundColor:grey[300], pb:2}}>
            <DialogContent>
            <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Razon Social</InputLabel>
             <TextField 
                autoFocus
                margin="dense"
                name="razonSocial"
                fullWidth
                value={formData.razonSocial}
                onChange={handleChange}
                sx={{backgroundColor:grey[50]}}
            />
            <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt:2}}>CUIT/RUT</InputLabel>
            <TextField
                margin="dense"
                name="cuit"
                fullWidth
                value={formData.cuit}
                onChange={handleChange}
                sx={{backgroundColor:grey[50]}}
            />
            <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt:2}}>Domicilio Fiscal</InputLabel>
            <TextField
                margin="dense"
                name="domicilio"
                fullWidth
                value={formData.domicilio}
                onChange={handleChange}
                sx={{backgroundColor:grey[50]}}
            />
            <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt:2}}>Telefono</InputLabel>
            <TextField
                margin="dense"
                name="telefono"
                fullWidth
                value={formData.telefono}
                onChange={handleChange}
                sx={{backgroundColor:grey[50]}}
            />
            </DialogContent>
            <DialogActions sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 6}}>
            <Button variant='contained' sx={{fontSize:'0.9em'}} onClick={handleClose}>Cancelar</Button>
            <Button variant="contained" sx={{fontSize:'0.9em'}} color="secondary" onClick={handleSubmit} > Guardar</Button>
            </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

export default Popup;