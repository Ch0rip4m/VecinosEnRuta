import { Button, Container, Box, Grid } from "@mui/material";
import ReadList from "../../components/listas/ListaLectura";
import VerRuta from "../../components/mapas/VerRuta";
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../Utils/Variables";
import axios from "axios";

const columns = [
  { id: "nombre_ruta", label: "Nombre", minWidth: 1 },
  { id: "origen", label: "Origen", minWidth: 1 },
  { id: "destino", label: "Destino", minWidth: 1 },
  { id: "dias", label: "Días", minWidth: 100 },
  { id: "hora_salida", label: "Salida", minWidth: 1 },
];

export default function MisRutas() {
  const [rutas, setRutas] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      axios
        .get(BACKEND_URL + "/db-manager/usuarios/email/" + email + "/", {
          withCredentials: true,
        })
        .then((response) => {
          const rutas = response.data.rutas;
          console.log(rutas)
          setRutas(rutas);
        })
        .catch((error) =>
          console.error("Error al obtener los datos del usuario:", error)
        );
    }
  }, []);

  const handleButtonCreate = () => {
    window.location.href = "/mis-rutas/crear";
  };

  const handleButtonEdit = () => {
    window.location.href = "/mis-rutas/editar";
  };

  return (
    <Container maxWidth="xs">
      <Box
        component="container"
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={6}>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={handleButtonCreate}
            >
              Crear Ruta
            </Button>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={handleButtonEdit}
            >
              Editar Ruta
            </Button>
          </Grid>
        </Grid>
        <ReadList columns={columns} rows={rutas} height={550}/>
        <VerRuta width="100%" height="250px"/>
      </Box>
    </Container>
  );
}
