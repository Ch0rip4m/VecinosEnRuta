import React, { useEffect, useState } from "react";
import { Container, Grid, Box, Tabs, Tab, Typography } from "@mui/material";
import { BACKEND_URL } from "../../Utils/Variables";
import ListaSolicitud from "../../components/listas/ListaBoton";
import BasicModal from "../../components/modals/InfoModal";
import axios from "axios";
import { useSnackbar } from "../../contexts/SnackbarContext";

const csrfToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("csrftoken="))
  ?.split("=")[1];

const columnsRouteRequest = [
  { id: "id_ruta", obj_id: "nombre_ruta", label: "Ruta" },
  { id: "id_solicitante", obj_id: "nombre_usuario", label: "Usuario" },
];

const columnsCommunityRequest = [
  { id: "id_comunidad", obj_id: "nombre_comunidad", label: "Comunidad" },
  { id: "id_solicitante", obj_id: "nombre_usuario", label: "Usuario" },
];

const modalInfo = [
  { id: "nombre_usuario", label: "Nombre" },
  { id: "apellido_usuario", label: "Apellido" },
  { id: "edad", label: "Edad" },
  { id: "sexo", label: "Sexo" },
  { id: "email", label: "Correo Electrónico" },
  { id: "telefono", label: "Telefono" },
  { id: "descripcion_usuario", label: "Descripción" },
];

export default function Solicitudes() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [value, setValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const snackbar = useSnackbar();

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
        setNotificaciones(response.data);
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

  const handleAcceptRouteRequest = (row) => {
    axios
      .post(
        BACKEND_URL + "/db-manager/aceptar_solicitud_ruta/",
        {},
        {
          params: {
            id_ruta: row.id_ruta.id_ruta,
            id_solicitud: row.id_notificacion,
          },
          headers: { "X-CSRFToken": csrfToken },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        snackbar.success("Solicitud aceptada");
      })
      .catch((error) => {
        console.error("error al acpetar solicitud", error);
        snackbar.error("Error al aceptar solicitud");
      });
  };

  const handleAcceptComRequest = (row) => {
    axios
      .post(
        BACKEND_URL + "/db-manager/aceptar_solicitud_comunidad/",
        {},
        {
          params: {
            id_comunidad: row.id_comunidad.id_comunidad,
            id_solicitud: row.id_notificacion,
          },
          headers: { "X-CSRFToken": csrfToken },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        snackbar.success("Solicitud aceptada");
      })
      .catch((error) => {
        console.error("error al acpetar solicitud", error);
        snackbar.error("Error al aceptar solicitud");
      });
  };

  const handleSelectRow = (row) => {
    setSelectedRow(row); // Guardar la fila seleccionada
    setOpenModal(true); // Abrir el modal
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Cerrar el modal
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
          <Tab label="rutas" />
          <Tab label="comunidad" />
        </Tabs>
        <Box sx={{ marginTop: 3, textAlign: "center", width: "100%" }}>
          {value === 0 && (
            <Grid container spacing={2}>
              {solicitudesDeRuta.length > 0 ? (
                <ListaSolicitud
                  columns={columnsRouteRequest}
                  rows={solicitudesDeRuta}
                  height={550}
                  buttonLabel="Aceptar"
                  onClickButtonFunction={handleAcceptRouteRequest}
                  onClickRowFunction={handleSelectRow}
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
                  onClickButtonFunction={handleAcceptComRequest}
                  onClickRowFunction={handleSelectRow}
                />
              ) : (
                <Typography variant="body2">No hay solicitudes</Typography>
              )}
            </Grid>
          )}
        </Box>
      </Box>
      {/* Renderizando el modal */}
      {selectedRow && (
        <BasicModal
          open={openModal}
          handleClose={handleCloseModal}
          modalInfo={modalInfo}
          imgURL={selectedRow.id_solicitante.imagen_perfil}
          title="DETALLE DE LA SOLICITUD"
          description={selectedRow.id_solicitante}
        />
      )}
    </Container>
  );
}
