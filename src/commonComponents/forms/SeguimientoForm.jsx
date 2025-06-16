import { Box, InputLabel, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { grey } from "@mui/material/colors";

const SeguimientoForm = ({ formData, handleChange }) => (
  <>
    <InputLabel sx={{color: grey[900], fontWeight: 'bold'}}>ID de Viaje</InputLabel>
    <TextField 
      fullWidth 
      margin="dense" 
      name="idViaje" 
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

export default SeguimientoForm;