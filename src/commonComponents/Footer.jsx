import { Box, Stack, Link, Typography} from "@mui/material";
import  GitHubIcon  from '@mui/icons-material/GitHub';

const Footer = () => {

  return (<Box component="footer" sx={{ 
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-around', 
    width: '100%', 
    height: '2,5rem',
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#062B60',
    typography: 'footer',
    py: 3}}>
      <Stack direction="column">
        <Box sx={{ display: 'flex', justifyContent: 'center'}}><Typography variant="body2">  
          <strong>Materia:</strong> Desarrollo de Aplicaciones. 1er Cuatrimestre 2025.</Typography>  
        </Box>
      </Stack>

      <Stack direction="column">
        <Box sx={{ display: 'flex', justifyContent: 'center'}}><Typography variant="body2">
          <strong>Integrantes: </strong>
          Hereñú Luis, Lois Erika Patricia, Nicolaus Brian Hernan, Ricci Paula, Torres Marcelo Alejandro.</Typography> 
        </Box>
      </Stack>


      <Stack alignItems="center" direction="row" gap={2}>
        <Link 
          href="https://github.com/DesApp-2025c1-Grupo-4" 
          target="_blank" 
          rel="noopener noreferrer" 
          color="inherit" 
          underline="hover"
        >
          <Typography variant="body2">Repositorio</Typography>
          
        </Link>
        <GitHubIcon variant="footer"/>
      </Stack>
    </Box>);
}

export default Footer;