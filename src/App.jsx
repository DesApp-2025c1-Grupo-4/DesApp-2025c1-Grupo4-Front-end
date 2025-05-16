import React, { useEffect, useState } from "react";
import { Box, Grid, Stack } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { TopMenu } from "./components/TopMenu";
import { NavBar } from "./components/NavBar";
import { AppRouter } from "./AppRouter";


export function App() {
  
  return (
    <BrowserRouter>
      <Stack direction='column'>
        <Grid container direction='row'>
          <NavBar />
        </Grid>
        <Box sx={{mx: { xs: 1, md: 4 }, my: 4}}>
          <AppRouter />
        </Box>
      </Stack>
    </BrowserRouter>
  )
}
