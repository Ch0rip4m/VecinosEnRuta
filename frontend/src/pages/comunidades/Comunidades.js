import { Container, Box, Grid, Button, Typography, Snackbar } from "@mui/material";
import ReadList from "../../components/listas/ListaLectura";
import ListaSolicitud from "../../components/listas/ListaBoton";
import VerComunidades from "../../components/mapas/MapaComunidades";
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../Utils/Variables";
import axios from "axios";
import { useSnackbar } from "../../contexts/SnackbarContext";

const csrfToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("csrftoken="))
  ?.split("=")[1];

const columns = [
  { id: "nombre_comunidad", label: "Nombre comunidad" },
  { id: "comunas", label: "Ubicación" },
];

export default function Comunidades() {
  const [comunidades, setComunidades] = useState([]);
  const [userCommunity, setUserCommunity] = useState([]);
  const [mapValues, setMapValues] = useState([]);
  const [selectCommunity, setSelectCommunity] = useState([]);
  const [dataExist, setDataExist] = useState(false);
  const snackbar = useSnackbar(); 

  useEffect(() => {
    axios
      .get(BACKEND_URL + "/db-manager/mostrar-comunidades/", {
        params: {
          id_usuario: localStorage.getItem("user_id"),
        },
        withCredentials: true, // Si necesitas enviar cookies
      })
      .then((response) => {
        //console.log(response.data);
        setComunidades(response.data);
      })
      .catch((error) => {
        console.error("error al obtener las ruta", error);
      });
  }, []);

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

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      axios
        .get(BACKEND_URL + "/db-manager/usuarios/email/" + email + "/", {
          withCredentials: true,
        })
        .then((response) => {
          const user_community = response.data.comunidad;
          if (user_community) {
            setUserCommunity(user_community);
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

  const handleButtonRequest = (row) => {
    axios
      .post(
        BACKEND_URL + "/db-manager/solicitar-unirse/",
        {},
        {
          params: { id_comunidad: row.id_comunidad, id_solicitante: localStorage.getItem('user_id') },
          headers: { "X-CSRFToken": csrfToken },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        snackbar.success("Solicitud enviada")
      })
      .catch((error) => {
        console.error("Error al hacer la solicitud", error);
        snackbar.error("Error al enviar la solicitud")
      });
  };

  const handleSelectCommunity = (row) => {
    setSelectCommunity([row.longitud, row.latitud]);
    console.log("selectCommunity", selectCommunity);
    if (selectCommunity.length > 0) {
      setDataExist(true);
    }
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
              crear comunidad
            </Button>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button color="primary" variant="contained" fullWidth>
              Editar comunidad
            </Button>
          </Grid>
        </Grid>
        <Typography variant="overline" sx={{ mt: 1 }}>
          Mis comunidades
        </Typography>
        <ReadList columns={columns} rows={userCommunity} height={550} />
        {dataExist ? (
          <VerComunidades
            width="100%"
            height="350px"
            mapValues={mapValues}
            selectCommunity={selectCommunity}
          />
        ) : (
          <VerComunidades width="100%" height="350px" mapValues={mapValues} />
        )}
        <Typography variant="overline" sx={{ mt: 1 }}>
          ¡Unete a una comunidad!
        </Typography>
        <ListaSolicitud
          columns={columns}
          rows={comunidades}
          height={550}
          buttonLabel="Unirse"
          onClickButtonFunction={handleButtonRequest}
          onClickRowFunction={handleSelectCommunity}
        />
      </Box>
    </Container>
  );
}

// <Mapa width="100%" height="250px" />
