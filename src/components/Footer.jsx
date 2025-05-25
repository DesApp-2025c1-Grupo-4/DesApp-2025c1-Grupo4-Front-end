import { Box, Stack, Button} from "@mui/material";
import { useLocation } from "react-router-dom";
import  GitHubIcon  from '@mui/icons-material/GitHub';

export function Footer() {

    const { pathname } = useLocation();
    if (pathname != "/") return null;

    return <Box sx={{ display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-around', 
        width: '100%', 
        height: '3rem',
        textAlign: 'center',
        color: 'white',
        backgroundColor: '#062B60',
        typography: 'footer',
        py: 3}}>
            <Stack direction="column">
                <Box sx={{ display: 'flex', justifyContent: 'center'}}><Box sx={{fontWeight: 'bold'}}>Materia: </Box>
                Desarrollo de Aplicaciones. 1er Cuatrimestre 2025.</Box>
            </Stack>

            <Stack direction="column">
                <Box sx={{ display: 'flex', justifyContent: 'center'}}><Box sx={{fontWeight: 'bold'}}>Integrantes: </Box>
                Hereñú Luis, Lois Erika Patricia, Nicolaus Brian Hernan, Ricci Paula, Torres Marcelo Alejandro.</Box>
            </Stack>

            <Stack direction="column">
                <Box sx={{ display: 'flex', justifyContent: 'center'}}>
                    <Button variant="contained" endIcon={<GitHubIcon/>}>Repositorio</Button>
                </Box>
            </Stack>
    </Box>;
}