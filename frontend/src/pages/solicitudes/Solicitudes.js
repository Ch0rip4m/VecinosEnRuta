import React, { useEffect, useState } from "react";
import { Container, Grid, Box, Tabs, Tab, Typography } from "@mui/material";
import { BACKEND_URL } from "../../Utils/Variables";
import ListaSolicitud from "../../components/listas/ListaBoton";
import axios from "axios";

const csrfToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("csrftoken="))
  ?.split("=")[1];

const columnsRoutRequest = [
  { id: "id_ruta", obj_id: "nombre_ruta", label: "Ruta" },
  { id: "id_solicitante", obj_id: "nombre_usuario", label: "Usuario" },
];

const columnsCommunityRequest = [
  { id: "id_comunidad", obj_id: "nombre_comunidad", label: "Comunidad" },
  { id: "id_solicitante", obj_id: "nombre_usuario", label: "Usuario" },
];

export default function Solicitudes() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    axios
      .get(
        BACKEND_URL +
          "/db-manager/mostrar-solicitudes/" +
          localStorage.getItem("user_id") +
          "/",
        { withCredentials: true }
      )
      .then((response) => {
        //console.log(response.data);
        setNotificaciones(response.data);
        // const getRutas = notificaciones.map((item) => item.id_ruta)
        // console.log(getRutas)
        // setInfoRutas(getRutas)
      })
      .catch((error) => {
        console.error("Error al obtener las notificaciones:", error);
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(value);
  };

  // Filtrar las notificaciones no leídas y leídas
  const solicitudesDeRuta = notificaciones.filter(
    (solicitud) => solicitud.es_ruta && !solicitud.aceptada
  );
  const solicitudesDeComunidad = notificaciones.filter(
    (solicitud) => solicitud.es_comunidad && !solicitud.aceptada
  );

  const handleAcceptRequest = (row) => {
    axios
      .post(
        BACKEND_URL + "/db-manager/aceptar_solicitud_ruta/",
        {},
        {
          params: { id_ruta: row.id_ruta.id_ruta, id_solicitud: row.id_notificacion },
          headers: { "X-CSRFToken": csrfToken },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("error al acpetar solicitud", error);
      });
  };

  useEffect(() => {
    console.log("notificaciones", notificaciones);
    // console.log("L",solicitudesLeidas)
    // console.log("NL",solicitudesNoLeidas)
  }, [solicitudesDeRuta, solicitudesDeComunidad, notificaciones]);

  // useEffect(() => {
  //   console.log("infoRutas",infoRutas)
  //   console.log("infoComunidades",infoComunidades)
  // },[infoRutas, infoComunidades])

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
          <Tab label="rutas" />
          <Tab label="comunidad" />
        </Tabs>
        <Box sx={{ marginTop: 3, textAlign: "center", width: "100%" }}>
          {value === 0 && (
            <Grid container spacing={2}>
              {solicitudesDeRuta.length > 0 ? (
                <ListaSolicitud
                  columns={columnsRoutRequest}
                  rows={solicitudesDeRuta}
                  height={550}
                  buttonLabel="Aceptar"
                  onClickButtonFunction={handleAcceptRequest}
                />
              ) : (
                <Typography variant="body2">No hay solicitudes</Typography>
              )}
            </Grid>
          )}

          {value === 1 && (
            <Grid container spacing={2}>
              {solicitudesDeComunidad.length > 0 ? (
                <ListaSolicitud
                  columns={columnsCommunityRequest}
                  rows={solicitudesDeComunidad}
                  height={550}
                  buttonLabel="Aceptar"
                  onClickButtonFunction={handleAcceptRequest}
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
