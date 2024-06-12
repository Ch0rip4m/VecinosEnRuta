import { Button, Container, Box, Grid } from "@mui/material";
//import ContentListTable from "../components/Lista";
import Mapa from "../components/Mapas";
import React from "react";
import BasicModal from "../components/Modal";
import { BACKEND_URL } from "../Utils/Variables";

const columns = [
  {
    header: "Nombre de la ruta",
    accessorKey: "nombre_ruta",
    enableEditing: true,
    createable: true,
    type: "gridFieldText",
  },
  {
    header: "Origen",
    accessorKey: "origen",
    enableEditing: true,
    createable: true,
    type: "gridFieldText",
  },
  {
    header: "Destino",
    accessorKey: "destino",
    enableEditing: true,
    createable: true,
    type: "gridFieldText",
  },
  {
    header: "Hora de salida",
    accessorKey: "hora_salida",
    enableEditing: true,
    createable: true,
    type: "gridFieldText",
  },
];

export default function MisRutas() {
  return (
    <Container maxWidth="xs">
      <Box
        component="container"
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6} sm={6}>
            <BasicModal
              label="Crear ruta"
              url={BACKEND_URL + "/db-manager/rutas/"}
              title={"¡Ingresa los datos de tu ruta!"}
              columns={columns}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button color="primary" variant="contained" fullWidth>
              Eliminar Ruta
            </Button>
          </Grid>
        </Grid>
        <Mapa width="100%" height="250px" />
      </Box>
    </Container>
  );
}
