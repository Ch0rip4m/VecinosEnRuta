import { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Mapa from "../components/Mapas";
import ContentListTable from "../components/Lista";
import axios from "axios";

const columns = [
  { id: "id_ruta", label: "Nombre Ruta", minWidth: 170 },
  { id: "solicitud", label: "Solicitud", minWidth: 100 },
];

function createData(id_ruta, solicitud) {
  return { id_ruta, solicitud };
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

export default function Inicio() {
  const [formData, setformData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requiredFields = ["origen", "destino"];
    const errors = {};
    let hasErrors = false;

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = "Este campo es obligatorio";
        hasErrors = true;
      }
    });
    if (hasErrors) {
      setFormErrors(errors);
    }
  };

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setformData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: null });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          ¿A donde vas?
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3, textAlign: "center" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Origen"
                name="origen"
                value={formData.origen}
                onChange={handleTextChange}
                error={Boolean(formErrors.origen)}
                helperText={formErrors.origen}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="destino"
                label="Destino"
                value={formData.destino}
                onChange={handleTextChange}
                error={Boolean(formErrors.destino)}
                helperText={formErrors.destino}
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }}>
            Buscar
          </Button>
        </Box>
        <Mapa width="100%" height="250px" />
        <ContentListTable columns={columns} rows={rows} />
      </Box>
    </Container>
  );
}
