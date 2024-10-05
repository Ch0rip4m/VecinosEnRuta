import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Mapa from "../components/Mapas";
import TableRequest from "../components/ListaBoton";
import axios from "axios";
import { BACKEND_URL } from "../Utils/Variables";

const columns = [
  { id: "id_ruta", label: "Nombre Ruta", minWidth: 170 },
  { id: "solicitud", label: "Solicitud", minWidth: 100 },
];

function createData(id_ruta, solicitud, ubicacion) {
  const lista = {id_ruta, solicitud, ubicacion}
  return lista;
}

const rows = [
  createData("India", "IN", "Tierra"),
  createData("China", "CN", "Tierra"),
  createData("Italy", "IT", "Tierra"),
  createData("United States", "US", "Tierra"),
  createData("Canada", "CA", "Tierra"),
  createData("Australia", "AU", "Tierra"),
  createData("Germany", "DE", "Tierra"),
  createData("Ireland", "IE", "Tierra"),
  createData("Mexico", "MX", "Tierra"),
  createData("Japan", "JP", "Tierra"),
  createData("France", "FR", "Tierra"),
  createData("United Kingdom", "GB", "Tierra"),
  createData("Russia", "RU", "Tierra"),
  createData("Nigeria", "NG", "Tierra"),
  createData("Brazil", "BR", "Tierra"),
];

export default function Inicio() {
  const [formData, setformData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      axios
        .get(BACKEND_URL + "/db-manager/usuarios/email/" + email + "/")
        .then((response) => {
          console.log("respuesta:", response.data);
          const usuario = response.data.usuario;
          const vehiculo = response.data.vehiculo;
          localStorage.setItem('user_id', usuario.id_usuario)
          if (vehiculo) {
            localStorage.setItem("car_id", vehiculo.id_vehiculo);
          }
        })
        .catch((error) =>
          console.error("Error al obtener los datos del usuario:", error)
        );
    }
  }, []);

  useEffect(() => {
    console.log("ROWS: ", rows);
  }, [rows]);

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="overline" sx={{ mt: 1 }}>
          ¡Busca tu ruta!
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 1, textAlign: "center" }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                required
                margin="dense"
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
                margin="dense"
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
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 1, mb: 2, bgcolor: "var(--navbar-color)" }}
          >
            Buscar
          </Button>
        </Box>
        <Mapa width="100%" height="250px" />
        <TableRequest columns={columns} rows={rows} buttonLabel='Unirse' />
      </Box>
    </Container>
  );
}
