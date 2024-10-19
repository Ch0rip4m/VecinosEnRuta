import { Container, Box, Grid, Button } from "@mui/material";
import ReadList from "../../components/listas/ListaLectura";
import VerComunidades from "../../components/mapas/MapaComunidades";
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../Utils/Variables";
import axios from "axios";

const columns = [
  { id: "nombre_comunidad", label: "Nombre comunidad" },
  { id: "comunas", label: "Ubicación" },
];

export default function Comunidades() {
  const [comunidad, setComunidad] = useState([]);
  const [mapValues, setMapValues] = useState([]);

  useEffect(() => {
    axios
      .get(BACKEND_URL + "/db-manager/comunidades/", {
        withCredentials: true,
      })
      .then((response) => {
        //console.log(response.data);
        const getCoordinates = response.data.map((item) => [
          item.longitud,
          item.latitud,
        ]);
        setMapValues(getCoordinates);
      })
      .catch((error) =>
        console.error("Error al obtener los datos del usuario:", error)
      );
  }, []);

  // useEffect(() => {
  //   console.log("mapValues", mapValues);
  // }, [mapValues]);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      axios
        .get(BACKEND_URL + "/db-manager/usuarios/email/" + email + "/", {
          withCredentials: true,
        })
        .then((response) => {
          const comunidad = response.data.comunidad;
          if (comunidad) {
            setComunidad(comunidad);
          }
        })
        .catch((error) =>
          console.error("Error al obtener los datos del usuario:", error)
        );
    }
  }, []);

  const handleButtonCreate = () => {
    window.location.href = "/comunidades/crear";
  };

  return (
    <Container maxWidth="xs">
      <Box
        component="container"
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6} sm={6}>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={handleButtonCreate}
            >
              crear comunidad
            </Button>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button color="primary" variant="contained" fullWidth>
              Editar comunidad
            </Button>
          </Grid>
        </Grid>
        <ReadList
          columns={columns}
          rows={comunidad}
          height={550}
        />
        <VerComunidades width="100%" height="250px" mapValues={mapValues} />
      </Box>
    </Container>
  );
}

// <Mapa width="100%" height="250px" />
