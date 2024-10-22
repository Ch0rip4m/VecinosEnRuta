import { Container, Box, Grid, Button } from "@mui/material";
import EditList from "../../components/listas/ListaEdicion";
import VerRuta from "../../components/mapas/VerRuta";
import React from "react";
import { BACKEND_URL } from "../../Utils/Variables";

const columns = [
  { id: "id_ruta", label: "Nombre Ruta", minWidth: 170 },
  { id: "solicitud", label: "Solicitud", minWidth: 100 },
];

function createData(id_ruta, solicitud) {
  const lista = { id_ruta };
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

export default function EditarRutas() {
  return (
    <Container maxWidth="xs">
      <Box
        component="container"
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <EditList columns={columns} rows={rows} height={500} />
      </Box>
    </Container>
  );
}
