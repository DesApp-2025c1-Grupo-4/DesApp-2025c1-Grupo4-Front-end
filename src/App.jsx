import { Box, Grid, Stack } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/Header";
import { AppRouter } from "./AppRouter";


export function App() {
  
  return (
    <BrowserRouter>
      <Stack direction='column'>
        <Grid container direction='row'>
          <Header />
        </Grid>
        <Box sx={{mx: { xs: 1, md: 4 }, my: 4}}>
          <AppRouter />
        </Box>
      </Stack>
    </BrowserRouter>
  )
}
