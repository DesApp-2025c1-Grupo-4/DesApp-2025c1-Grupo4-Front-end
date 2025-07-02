import { Box, InputLabel, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { grey } from "@mui/material/colors";

const SeguimientoForm = ({ formData, handleChange }) => (
  <>
    <InputLabel sx={{ color: grey[700], fontWeight: 'bold', mb: 0.5 }}>ID de Viaje</InputLabel>
    <TextField fullWidth margin="dense" name="idViaje" value={formData.idViaje} onChange={handleChange}sx={{ backgroundColor: grey[50],'& .MuiOutlinedInput-root': {borderRadius: 2,'& fieldset': {borderColor: grey[300] }}}} />
    <Box sx={{ mt: 3 }}>
      <TableContainer component={Paper} sx={{ boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold',textAlign: 'center' }}>Horario</TableCell>
              <TableCell sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold',textAlign: 'center' }}>Estado</TableCell>
              <TableCell sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold',textAlign: 'center' }}>Ubicación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ textAlign: 'center' }}>2023-10-01 08:00</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>En camino</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Ubicación A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ textAlign: 'center' }}>2023-10-01 10:30</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>En espera</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Ubicación B</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </>
);

export default SeguimientoForm;