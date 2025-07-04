import { TextField } from '@mui/material';
import { grey } from '@mui/material/colors';

const ValidatedTextField = ({ 
  initialValue = '', 
  touched = false, 
  formValue, 
  onBlur, 
  error,
  ...props 
}) => (
  <TextField
    {...props}
    onBlur={(e) => {
      if (e.target.value !== initialValue) {
        onBlur(e);
      }
    }}
    error={!!error && (touched || formValue !== initialValue)}
    helperText={(touched || formValue !== initialValue) ? error : ''}
    sx={{
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        '& fieldset': { borderColor: grey[300] }
      },
      ...props.sx
    }}
  />
);

export default ValidatedTextField;