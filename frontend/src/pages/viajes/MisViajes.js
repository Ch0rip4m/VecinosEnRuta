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
  { id: "nombre_ruta", label: "Ruta" },
  { id: "origen", label: "Origen" },
  { id: "destino", label: "Destino" },
  { id: "hora_salida", label: "Salida" },
];

const columnsExeRoute = [
  { id: "id_ruta", obj_id: "nombre_ruta", label: "Ruta" },
  { id: "inicio_real", label: "Hora salida" },
];

// { id: "id_ruta", obj_id: "nombre_ruta", label: "Ruta" },
//   { id: "id_ruta", obj_id: "origen", label: "Origen" },
//   { id: "id_ruta", obj_id: "destino", label: "Destino" },
//   { id: "id_ruta", obj_id: "hora_salida", label: "Salida" },

export default function MisViajes() {
  const [value, setValue] = useState(0);
  const [viajes, setViajes] = useState([]);
  const [viajesEje, setViajesEje] = useState([]);
  const [ordenTrayectoria, setOrdenTrayectoria] = useState([]);
  const [dataExist, setDataExist] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(value);
  };

  const formatearFecha = (fechaISO) => {
    return fechaISO.slice(0, 19).replace("T", " ");
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
        setViajes(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las notificaciones:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        BACKEND_URL +
          "/db-manager/mostrar-viajes-ejecutados/" +
          localStorage.getItem("user_id") +
          "/",
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        const viajesFormateados = response.data.map((viaje) => ({
          ...viaje,
          inicio_real: formatearFecha(viaje.inicio_real), // Formatear la fecha aquí
        }));
        setViajesEje(viajesFormateados);
      })
      .catch((error) => {
        console.error("Error al obtener las notificaciones:", error);
      });
  }, []);

  useEffect(() => {
    // Redirigir a la nueva página cuando los datos de trayectoria estén listos
    if (dataExist && ordenTrayectoria.length > 0) {
      localStorage.setItem("ordenTrayectoria", JSON.stringify(ordenTrayectoria));
      window.location.href = "/ruta-en-ejecucion";
    }
  }, [dataExist, ordenTrayectoria]);

  const handleStartRoute = (row) => {
    // Primero, iniciar la ruta con el POST
    axios
      .post(
        `${BACKEND_URL}/db-manager/iniciar-ruta/`,
        {},
        {
          params: { id_ruta: row.id_ruta, id_usuario: localStorage.getItem("user_id") },
          headers: { "X-CSRFToken": csrfToken },
          withCredentials: true,
        }
      )
      .then(() => {
        // Luego, obtener los datos de trayectoria con el GET
        return axios.get(`${BACKEND_URL}/db-manager/mostrar-ruta/`, {
          params: { id_ruta: row.id_ruta },
          withCredentials: true,
        });
      })
      .then((response) => {
        if (response && response.data.length > 0) {
          setOrdenTrayectoria(response.data);
          setDataExist(true); // Esto activará el efecto y redirigirá si los datos existen
        }
      })
      .catch((error) => {
        console.error("Error al iniciar la ruta o obtener los datos de trayectoria:", error);
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
              {viajes.length > 0 ? (
                <ListaSolicitud
                  columns={columnsRouteRequest}
                  rows={viajes}
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
              {viajesEje.length > 0 ? (
                <ReadList
                  columns={columnsExeRoute}
                  rows={viajesEje}
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
