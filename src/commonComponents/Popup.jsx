import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { grey } from "@mui/material/colors";
import { ROUTE_CONFIG } from '../config/routesConfig';

const Popup = ({
  buttonName,       // Para uso en Filtro (modo no controlado)
  page,             // Para ambos
  open,             // Para uso controlado (MenuBotones/ListadoViajes)
  onClose           // Para uso controlado
}) => {
  // Estado interno para cuando se usa en modo no controlado (Filtro)
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Determinar si el popup se controla externamente o internamente
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : internalOpen;
  const currentOnClose = isControlled ? onClose : () => setInternalOpen(false);

  const [formData, setFormData] = useState({
    // Campos originales
    razonSocial: '',
    cuit: '',
    domicilio: '',
    telefono: '',
    // Campos para viajes
    idViaje: '',
    depositoOrigen: '',
    depositoDestino: '',
    fechaHoraInicio: '',
    fechaHoraFin: '',
    empresa: '',
    chofer: '',
    vehiculo: ''
  });

  const handleOpen = () => !isControlled && setInternalOpen(true);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    currentOnClose();
  };

  const currentPage = ROUTE_CONFIG[`/${page}`];

  const renderFormContent = () => {
    switch(page) {
      case 'registrar-viaje':
        return (
          <>
            <InputLabel sx={{color: grey[900], fontWeight: 'bold'}}>Depósito de Origen</InputLabel>
            <TextField 
              margin="dense"
              name="depositoOrigen"
              fullWidth
              value={formData.depositoOrigen}
              onChange={handleChange}
              sx={{backgroundColor: grey[50]}}
            />

            <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt:2}}>Depósito de Destino</InputLabel>
            <TextField
              margin="dense"
              name="depositoDestino"
              fullWidth
              value={formData.depositoDestino}
              onChange={handleChange}
              sx={{backgroundColor: grey[50]}}
            />

            <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt:2}}>Fecha y Hora de Inicio</InputLabel>
            <TextField
              margin="dense"
              name="fechaHoraInicio"
              fullWidth
              type="datetime-local"
              value={formData.fechaHoraInicio}
              onChange={handleChange}
              sx={{backgroundColor: grey[50]}}
            />

            <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt:2}}>Fecha y Hora de Fin</InputLabel>
            <TextField
              margin="dense"
              name="fechaHoraFin"
              fullWidth
              type="datetime-local"
              value={formData.fechaHoraFin}
              onChange={handleChange}
              sx={{backgroundColor: grey[50]}}
            />

            <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt:2}}>Empresa</InputLabel>
            <TextField
              margin="dense"
              name="empresa"
              fullWidth
              value={formData.empresa}
              onChange={handleChange}
              sx={{backgroundColor: grey[50]}}
            />

            <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt:2}}>Chofer</InputLabel>
            <TextField
              margin="dense"
              name="chofer"
              fullWidth
              value={formData.chofer}
              onChange={handleChange}
              sx={{backgroundColor: grey[50]}}
            />

            <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt:2}}>Vehículo</InputLabel>
            <TextField
              margin="dense"
              name="vehiculo"
              fullWidth
              value={formData.vehiculo}
              onChange={handleChange}
              sx={{backgroundColor: grey[50]}}
            />
          </>
        );

      case 'modificar-viaje':
        return (
          <>
            <InputLabel sx={{color: grey[900], fontWeight: 'bold'}}>ID de Viaje</InputLabel>
            <TextField 
              margin="dense"
              name="idViaje"
              fullWidth
              value={formData.idViaje}
              onChange={handleChange}
              sx={{backgroundColor: grey[50]}}
            />

            <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt:2}}>Depósito de Origen</InputLabel>
            <TextField 
              margin="dense"
              name="depositoOrigen"
              fullWidth
              value={formData.depositoOrigen}
              onChange={handleChange}
              sx={{backgroundColor: grey[50]}}
            />

            <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt:2}}>Depósito de Destino</InputLabel>
            <TextField
              margin="dense"
              name="depositoDestino"
              fullWidth
              value={formData.depositoDestino}
              onChange={handleChange}
              sx={{backgroundColor: grey[50]}}
            />

            <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt:2}}>Fecha y Hora de Inicio</InputLabel>
            <TextField
              margin="dense"
              name="fechaHoraInicio"
              fullWidth
              type="datetime-local"
              value={formData.fechaHoraInicio}
              onChange={handleChange}
              sx={{backgroundColor: grey[50]}}
            />

            <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt:2}}>Fecha y Hora de Fin</InputLabel>
            <TextField
              margin="dense"
              name="fechaHoraFin"
              fullWidth
              type="datetime-local"
              value={formData.fechaHoraFin}
              onChange={handleChange}
              sx={{backgroundColor: grey[50]}}
            />

            <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt:2}}>Empresa</InputLabel>
            <TextField
              margin="dense"
              name="empresa"
              fullWidth
              value={formData.empresa}
              onChange={handleChange}
              sx={{backgroundColor: grey[50]}}
            />

            <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt:2}}>Chofer</InputLabel>
            <TextField
              margin="dense"
              name="chofer"
              fullWidth
              value={formData.chofer}
              onChange={handleChange}
              sx={{backgroundColor: grey[50]}}
            />

            <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt:2}}>Vehículo</InputLabel>
            <TextField
              margin="dense"
              name="vehiculo"
              fullWidth
              value={formData.vehiculo}
              onChange={handleChange}
              sx={{backgroundColor: grey[50]}}
            />
          </>
        );

      case 'seguimiento':
        return (
          <>
            <InputLabel sx={{color: grey[900], fontWeight: 'bold'}}>ID de Viaje</InputLabel>
            <TextField 
              margin="dense"
              name="idViaje"
              fullWidth
              value={formData.idViaje}
              onChange={handleChange}
              sx={{backgroundColor: grey[50]}}
            />

            <Box sx={{ mt: 3 }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Horario</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Ubicación</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>2023-10-01 08:00</TableCell>
                      <TableCell>En camino</TableCell>
                      <TableCell>Ubicación A</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2023-10-01 10:30</TableCell>
                      <TableCell>En espera</TableCell>
                      <TableCell>Ubicación B</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        );

      default:
        return (
          <>
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
          </>
        );
    }
  };

  return (
    <>
      {!isControlled && (
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleOpen}
        >
          {buttonName}
        </Button>
      )}
    
      <Dialog open={currentOpen} onClose={currentOnClose} fullWidth sx={{backgroundColor: grey[50]}}>
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', px: 2}}>
            {currentPage?.logo}
            <DialogTitle color="primary" fontWeight={'bold'}>
                {currentPage?.newButton || buttonName}
            </DialogTitle>
         </Box>
        <Box sx={{backgroundColor:grey[300], pb:2}}>
            <DialogContent>
              {renderFormContent()}
            </DialogContent>
            <DialogActions sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 6}}>
              <Button variant='contained' sx={{fontSize:'0.9em'}} onClick={currentOnClose}>Cancelar</Button>
              <Button variant="contained" sx={{fontSize:'0.9em'}} color="secondary" onClick={handleSubmit}>Guardar</Button>
            </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default Popup;