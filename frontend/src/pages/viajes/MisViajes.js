import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Container, Grid, Box, Typography } from "@mui/material";
import ListaSolicitud from "../../components/listas/ListaBoton";
import ReadList from "../../components/listas/ListaLectura";
import axios from "axios";
import { BACKEND_URL } from "../../Utils/Variables";

const csrfToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("csrftoken="))
  ?.split("=")[1];

const columnsRouteRequest = [
  { id: "id_ruta", obj_id: "nombre_ruta", label: "Ruta" },
  { id: "id_ruta", obj_id: "origen", label: "Origen" },
  { id: "id_ruta", obj_id: "destino", label: "Destino" },
  { id: "id_ruta", obj_id: "hora_salida", label: "Salida" },
];

export default function MisViajes() {
  const [value, setValue] = useState(0);
  const [viajes, setViajes] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(value);
  };

  useEffect(() => {
    axios
      .get(
        BACKEND_URL +
          "/db-manager/mostrar-viajes/" +
          localStorage.getItem("user_id") +
          "/",
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        setViajes(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las notificaciones:", error);
      });
  }, []);

  // Filtrar las notificaciones no leídas y leídas
  const viajesRealizados = viajes.filter((viaje) => viaje.flag_inicio);
  const viajesProgramados = viajes.filter((viaje) => !viaje.flag_inicio);

  const handleStartRoute = (row) => {
    axios
      .post(
        BACKEND_URL + "/db-manager/iniciar-ruta/",
        {},
        {
          params: { id_ruta: row.id_ruta.id_ruta },
          headers: { "X-CSRFToken": csrfToken },
          withCredentials: true,
        }
      )
      .then((response) => {
        window.location.href = "/ruta-en-ejecucion";
      })
      .catch((error) => {
        console.error("Error al iniciar la ruta", error);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Viajes Programados" />
          <Tab label="Viajes Realizados" />
        </Tabs>
        <Box sx={{ marginTop: 3, textAlign: "center", width: "100%" }}>
          {value === 0 && (
            <Grid container spacing={2}>
              {viajesProgramados.length > 0 ? (
                <ListaSolicitud
                  columns={columnsRouteRequest}
                  rows={viajesProgramados}
                  height={550}
                  buttonLabel="iniciar"
                  onClickButtonFunction={handleStartRoute}
                />
              ) : (
                <Typography variant="body2">No hay solicitudes</Typography>
              )}
            </Grid>
          )}

          {value === 1 && (
            <Grid container spacing={2}>
              {viajesRealizados.length > 0 ? (
                <ReadList
                  columns={columnsRouteRequest}
                  rows={viajesRealizados}
                  height={550}
                />
              ) : (
                <Typography variant="body2">No hay solicitudes</Typography>
              )}
            </Grid>
          )}
        </Box>
      </Box>
    </Container>
  );
}
