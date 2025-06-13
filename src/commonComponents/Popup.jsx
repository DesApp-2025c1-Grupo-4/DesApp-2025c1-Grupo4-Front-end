import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Box, InputLabel, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { grey } from "@mui/material/colors";
import { ROUTE_CONFIG } from '../config/routesConfig';

const Popup = ({ buttonName, page, open, onClose, children, selectedItem }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : internalOpen;
  const currentOnClose = isControlled ? onClose : () => setInternalOpen(false);

  // Configuración inicial de datos
  const initialData = {
    // Datos para depósitos
    deposito: {
      tipo: '', horarios: '', calle: '', numero: '', provincia: '', pais: '', coordenadas: '',
      nombreContacto: '', apellidoContacto: '', dniContacto: '', telefonoContacto: '', razonSocial: '', cuit: ''
    },
    // Datos para viajes
    viaje: {
      idViaje: '', depositoOrigen: '', depositoDestino: '', fechaHoraInicio: '', fechaHoraFin: '', 
      empresa: '', chofer: '', vehiculo: '', tipoViaje: '', estado: ''
    },
    // Datos para choferes
    chofer: {
      nombre: '', apellido: '', dni: '', fechaNacimiento: '', empresa: '', vehiculoAsignado: ''
    },
    // Datos genéricos
    default: {
      razonSocial: '', cuit: '', domicilio: '', telefono: ''
    }
  };

  const [formData, setFormData] = useState(() => {
    if (!selectedItem) return initialData[page.includes('deposito') ? 'deposito' : page.includes('viaje') ? 'viaje' : page.includes('chofer') ? 'chofer' : 'default'];
    
    if (page.includes('deposito')) {
      return {
        ...initialData.deposito,
        tipo: selectedItem?.tipo || '',
        horarios: selectedItem?.horarios || '',
        calle: selectedItem?.localizacion?.calle || '',
        numero: selectedItem?.localizacion?.número || '',
        provincia: selectedItem?.localizacion?.provincia || '',
        pais: selectedItem?.localizacion?.pais || '',
        coordenadas: selectedItem?.localizacion?.coordenadas || '',
        nombreContacto: selectedItem?.contacto?.nombre || '',
        apellidoContacto: selectedItem?.contacto?.apellido || '',
        dniContacto: selectedItem?.contacto?.dni || '',
        telefonoContacto: selectedItem?.contacto?.telefono || '',
        razonSocial: selectedItem?.razonSocial || '',
        cuit: selectedItem?.cuit || ''
      };
    }

    if (page.includes('viaje')) {
      return {
        ...initialData.viaje,
        idViaje: selectedItem?._id || '',
        depositoOrigen: selectedItem?.origen || '',
        depositoDestino: selectedItem?.destino || '',
        fechaHoraInicio: selectedItem?.fechaInicio || '',
        fechaHoraFin: selectedItem?.fechaFin || '',
        empresa: selectedItem?.empresaTransportista || '',
        chofer: selectedItem?.nombreChofer || '',
        vehiculo: selectedItem?.patenteVehiculo || '',
        tipoViaje: selectedItem?.tipoViaje || '',
        estado: selectedItem?.estado || ''
      };
    }

    if (page.includes('chofer')) {
      return {
        ...initialData.chofer,
        nombre: selectedItem?.nombre || '',
        apellido: selectedItem?.apellido || '',
        dni: selectedItem?.dni || '',
        fechaNacimiento: selectedItem?.fechaNacimiento || '',
        empresa: selectedItem?.empresa || '',
        vehiculoAsignado: selectedItem?.vehiculoAsignado || ''
      };
    }

    return {
      ...initialData.default,
      razonSocial: selectedItem?.razonSocial || '',
      cuit: selectedItem?.cuit || '',
      domicilio: selectedItem?.domicilioFiscal || '',
      telefono: selectedItem?.telefono || ''
    };
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = () => { console.log('Form submitted:', formData); currentOnClose(); };
  const currentPage = ROUTE_CONFIG[`/${page}`];

  // Componentes de formulario
  const renderDepositoForm = () => (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Tipo de Depósito</InputLabel>
        <TextField fullWidth margin="dense" name="tipo" value={formData.tipo} onChange={handleChange} sx={{backgroundColor: grey[50]}} />

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Franja Horaria</InputLabel>
        <TextField fullWidth margin="dense" name="horarios" value={formData.horarios} onChange={handleChange} sx={{backgroundColor: grey[50]}} />

        <InputLabel sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Localización</InputLabel>
        <TextField fullWidth required margin="dense" name="calle" label="Dirección" value={formData.calle} onChange={handleChange} sx={{backgroundColor: grey[50], mb: 1}} />
        <TextField fullWidth margin="dense" name="numero" label="Número" value={formData.numero} onChange={handleChange} sx={{backgroundColor: grey[50], mb: 1}} />
        <TextField fullWidth required margin="dense" name="provincia" label="Provincia/Estado" value={formData.provincia} onChange={handleChange} sx={{backgroundColor: grey[50], mb: 1}} />
        <TextField fullWidth required margin="dense" name="pais" label="País" value={formData.pais} onChange={handleChange} sx={{backgroundColor: grey[50], mb: 1}} />
        <TextField fullWidth margin="dense" name="coordenadas" label="Coordenadas (opcional)" value={formData.coordenadas} onChange={handleChange} sx={{backgroundColor: grey[50]}} />
      </Grid>

      <Grid item xs={6}>
        <InputLabel sx={{color: grey[900], fontWeight: 'bold'}}>Personal de Contacto</InputLabel>
        <TextField fullWidth required margin="dense" name="nombreContacto" label="Nombre" value={formData.nombreContacto} onChange={handleChange} sx={{backgroundColor: grey[50], mb: 1}} />
        <TextField fullWidth required margin="dense" name="apellidoContacto" label="Apellido" value={formData.apellidoContacto} onChange={handleChange} sx={{backgroundColor: grey[50], mb: 1}} />
        <TextField fullWidth required margin="dense" name="dniContacto" label="DNI" value={formData.dniContacto} onChange={handleChange} sx={{backgroundColor: grey[50], mb: 1}} />
        <TextField fullWidth required margin="dense" name="telefonoContacto" label="Teléfono" value={formData.telefonoContacto} onChange={handleChange} sx={{backgroundColor: grey[50]}} />

        <InputLabel sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Información Legal</InputLabel>
        <TextField fullWidth required margin="dense" name="razonSocial" label="Razón Social" value={formData.razonSocial} onChange={handleChange} sx={{backgroundColor: grey[50], mb: 1}} />
        <TextField fullWidth required margin="dense" name="cuit" label="CUIT/RUT" value={formData.cuit} onChange={handleChange} sx={{backgroundColor: grey[50]}} />
      </Grid>
    </Grid>
  );

  const renderViajeForm = () => (
    <>
      <InputLabel sx={{color: grey[900], fontWeight: 'bold'}}>Depósito de Origen</InputLabel>
      <TextField fullWidth margin="dense" name="depositoOrigen" value={formData.depositoOrigen} onChange={handleChange} sx={{backgroundColor: grey[50]}} />

      <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Depósito de Destino</InputLabel>
      <TextField fullWidth margin="dense" name="depositoDestino" value={formData.depositoDestino} onChange={handleChange} sx={{backgroundColor: grey[50]}} />

      <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Fecha y Hora de Inicio</InputLabel>
      <TextField fullWidth margin="dense" name="fechaHoraInicio" type="datetime-local" value={formData.fechaHoraInicio} onChange={handleChange} sx={{backgroundColor: grey[50]}} />

      <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Fecha y Hora de Fin</InputLabel>
      <TextField fullWidth margin="dense" name="fechaHoraFin" type="datetime-local" value={formData.fechaHoraFin} onChange={handleChange} sx={{backgroundColor: grey[50]}} />

      <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Empresa</InputLabel>
      <TextField fullWidth margin="dense" name="empresa" value={formData.empresa} onChange={handleChange} sx={{backgroundColor: grey[50]}} />

      <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Chofer</InputLabel>
      <TextField fullWidth margin="dense" name="chofer" value={formData.chofer} onChange={handleChange} sx={{backgroundColor: grey[50]}} />

      <InputLabel sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Vehículo</InputLabel>
      <TextField fullWidth margin="dense" name="vehiculo" value={formData.vehiculo} onChange={handleChange} sx={{backgroundColor: grey[50]}} />
    </>
  );

  const renderChoferForm = () => (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Nombre</InputLabel>
        <TextField fullWidth margin="dense" name="nombre" value={formData.nombre} onChange={handleChange} sx={{backgroundColor: grey[50]}} />

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Apellido</InputLabel>
        <TextField fullWidth margin="dense" name="apellido" value={formData.apellido} onChange={handleChange} sx={{backgroundColor: grey[50]}} />

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>DNI</InputLabel>
        <TextField fullWidth margin="dense" name="dni" value={formData.dni} onChange={handleChange} sx={{backgroundColor: grey[50]}} />
      </Grid>

      <Grid item xs={6}>
        <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Fecha de Nacimiento</InputLabel>
        <TextField fullWidth margin="dense" name="fechaNacimiento" type="date" InputLabelProps={{ shrink: true }} value={formData.fechaNacimiento} onChange={handleChange} sx={{backgroundColor: grey[50]}} />

        <InputLabel required sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Empresa</InputLabel>
        <TextField fullWidth margin="dense" name="empresa" value={formData.empresa} onChange={handleChange} sx={{backgroundColor: grey[50]}} />

        <InputLabel sx={{color: grey[900], fontWeight: 'bold', mt: 2}}>Vehículo Asignado</InputLabel>
        <TextField fullWidth margin="dense" name="vehiculoAsignado" value={formData.vehiculoAsignado} onChange={handleChange} sx={{backgroundColor: grey[50]}} />
      </Grid>
    </Grid>
  );

  const renderSeguimiento = () => (
    <>
      <InputLabel sx={{color: grey[900], fontWeight: 'bold'}}>ID de Viaje</InputLabel>
      <TextField fullWidth margin="dense" name="idViaje" value={formData.idViaje} onChange={handleChange} sx={{backgroundColor: grey[50]}} />

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

  const renderDefaultForm = () => (
    <>
      <InputLabel required sx={{color: grey[900], fontWeight: 'bold'}}>Razon Social</InputLabel>
      <TextField fullWidth margin="dense" name="razonSocial" value={formData.razonSocial} onChange={handleChange} sx={{backgroundColor: grey[50]}} />

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>CUIT/RUT</InputLabel>
      <TextField fullWidth margin="dense" name="cuit" value={formData.cuit} onChange={handleChange} sx={{backgroundColor: grey[50]}} />

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Domicilio Fiscal</InputLabel>
      <TextField fullWidth margin="dense" name="domicilio" value={formData.domicilio} onChange={handleChange} sx={{backgroundColor: grey[50]}} />

      <InputLabel required sx={{color: grey[900], fontWeight: 'bold', pt: 2}}>Telefono</InputLabel>
      <TextField fullWidth margin="dense" name="telefono" value={formData.telefono} onChange={handleChange} sx={{backgroundColor: grey[50]}} />
    </>
  );

  const renderFormContent = () => {
    if (children) return children;
    if (page.includes('deposito')) return renderDepositoForm();
    if (page.includes('viaje')) return renderViajeForm();
    if (page.includes('chofer')) return renderChoferForm();
    if (page.includes('seguimiento')) return renderSeguimiento();
    return renderDefaultForm();
  };

  return (
    <>
      {!isControlled && <Button fullWidth variant="contained" color="primary" onClick={() => setInternalOpen(true)}>{buttonName}</Button>}
    
      <Dialog open={currentOpen} onClose={currentOnClose} fullWidth sx={{backgroundColor: grey[50]}}>
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', px: 2}}>
          {currentPage?.logo}
          <DialogTitle color="primary" fontWeight={'bold'}>{currentPage?.newButton || buttonName}</DialogTitle>
        </Box>
        <Box sx={{backgroundColor: grey[300], pb: 2}}>
          <DialogContent>{renderFormContent()}</DialogContent>
          <DialogActions sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 6}}>
            <Button variant='contained' sx={{fontSize: '0.9em'}} onClick={currentOnClose}>Cancelar</Button>
            <Button variant="contained" sx={{fontSize: '0.9em'}} color="secondary" onClick={handleSubmit}>
              {page.includes('registrar') ? 'Registrar' : 'Guardar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default Popup;