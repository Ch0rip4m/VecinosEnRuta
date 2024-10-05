import { Button, Container, Box, Grid } from "@mui/material";
import ContentListTable from "../components/Lista";
import DrawMap from "../components/DibujarRuta";
import React from "react";
import BasicModal from "../components/Modal";
import { BACKEND_URL } from "../Utils/Variables";

const columns = [
  { id: "id_ruta", label: "Nombre Ruta", minWidth: 170 },
  { id: "solicitud", label: "Solicitud", minWidth: 100 },
];

function createData(id_ruta, solicitud) {
  const lista = {id_ruta}
  return lista;
}

const rows = [
  createData("India", "IN"),
  createData("China", "CN"),
  createData("Italy", "IT"),
  createData("United States", "US"),
  createData("Canada", "CA"),
  createData("Australia", "AU"),
  createData("Germany", "DE"),
  createData("Ireland", "IE"),
  createData("Mexico", "MX"),
  createData("Japan", "JP"),
  createData("France", "FR"),
  createData("United Kingdom", "GB"),
  createData("Russia", "RU"),
  createData("Nigeria", "NG"),
  createData("Brazil", "BR"),
];

const columnsModal = [
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
    type: "gridFieldSearchSelector",
    requestData: "nombre_comuna",
    requestTable: "comunas",
  },
  {
    header: "Destino",
    accessorKey: "destino",
    enableEditing: true,
    createable: true,
    type: "gridFieldSearchSelector",
    requestData: "nombre_comuna",
    requestTable: "comunas",
  },
  {
    header: "Días",
    accessorKey: "nombre_dia",
    enableEditing: true,
    createable: true,
    type: "gridMultiSelector",
    requestData: "nombre_dia",
    requestTable: "dias",
  },
  {
    header: "Hora de salida",
    accessorKey: "hora_salida",
    enableEditing: true,
    createable: true,
    type: "gridFieldText",
  },
  {
    header: "DrawRout",
    accessorKey: "d_ruta",
    enableEditing: true,
    createable: true,
    type: "gridFieldMap",
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
              columns={columnsModal}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button color="primary" variant="contained" fullWidth>
              Eliminar Ruta
            </Button>
          </Grid>
        </Grid>
        <ContentListTable columns={columns} rows={rows} />
      </Box>
    </Container>
  );
}

//<DrawMap width="100%" height="250px" />
//