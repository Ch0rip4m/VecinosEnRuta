import { Button, Container, Box, Grid } from "@mui/material";
import ContentListTable from "../components/Lista";
import Mapa from "../components/Mapas";
import React from "react";

export default function MiRutas() {
  return (
    <Container maxWidth="xs">
      <Box
        component="container"
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6} sm={6}>
            <Button color="primary" variant="contained" fullWidth>
              Crear Ruta
            </Button>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button color="primary" variant="contained" fullWidth>
              Eliminar Ruta
            </Button>
          </Grid>
        </Grid>
        <ContentListTable />
        <Mapa width="100%" height="250px" />
      </Box>
    </Container>
  );
}
