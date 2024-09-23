import { Container, Box, Grid, Button } from "@mui/material";
//import ContentListTable from "../components/Lista";
import Mapa from "../components/Mapas";
import React from "react";
import BasicModal from "../components/Modal";
import { BACKEND_URL } from "../Utils/Variables";

const columns = [
  {
    header: "Nombre de la comunidad",
    accessorKey: "nombre_comunidad",
    enableEditing: true,
    createable: true,
    type: "gridFieldText",
  },
  {
    header: "Ubicación",
    accessorKey: "nombre_comuna",
    enableEditing: true,
    createable: true,
    type: "gridFieldSearchSelector",
    requestData: "nombre_comuna",
    requestTable: "comunas",
  },
];

export default function Comunidades() {
  return (
    <Container maxWidth="xs">
      <Box
        component="container"
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6} sm={6}>
            <BasicModal
              label="Crear comunidad"
              url={BACKEND_URL + "/db-manager/comunidades/"}
              title={"¡Ingresa los datos de tu comunidad!"}
              columns={columns}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button color="primary" variant="contained" fullWidth>
              Eliminar comunidad
            </Button>
          </Grid>
        </Grid>
        <Mapa width="100%" height="250px" />
      </Box>
    </Container>
  );
}
