import { Box, Stack, TextField } from "@mui/material";
import  GitHubIcon  from '@mui/icons-material/GitHub';

export function Footer() {

    return <Box sx={{ display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-around', 
        width: '100%', 
        height: '3rem', 
        position: 'fixed', 
        bottom: 0, 
        borderTop: 1, 
        borderColor: 'grey.500', 
        py: 4}}>
            <Stack direction="column">
                <Box sx={{ display: 'flex', justifyContent: 'center' , borderBottom: 1}}>Materia</Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>Desarrollo de Aplicaciones.</Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>1er Cuatrimestre 2025.</Box>
            </Stack>

            <Stack direction="column">
                <Box sx={{ display: 'flex', justifyContent: 'center',  borderBottom: 1 }}>Integrantes</Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', py:2, fontSize: 14 }}>Hereñú Luis, Lois Erika Patricia, Nicolaus Brian Hernan, Ricci Paula, Torres Marcelo Alejandro.</Box>
            </Stack>

            <Stack direction="column">
                <Box sx={{ display: 'flex', justifyContent: 'center', borderBottom: 1}}>Repositorio</Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}><GitHubIcon /></Box>
            </Stack>
            

          
            
            
            
    </Box>;
}