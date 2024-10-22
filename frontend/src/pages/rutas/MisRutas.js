import { Button, Container, Box, Grid } from "@mui/material";
import ReadList from "../../components/listas/ListaLectura";
import VerRuta from "../../components/mapas/VerRuta";
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../Utils/Variables";
import axios from "axios";

const columns = [
  { id: "nombre_ruta", label: "Nombre" },
  { id: "origen", label: "Origen" },
  { id: "destino", label: "Destino" },
  { id: "dias", label: "Días" },
  { id: "hora_salida", label: "Salida" },
];

export default function MisRutas() {
  const [rutas, setRutas] = useState([]);
  const [dataTrayectoria, setDataTrayectoria] = useState({});
  const [ordenTrayectoria, setOrdenTrayectoria] = useState([]);
  const [dataExist, setDataExist] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      axios
        .get(BACKEND_URL + "/db-manager/usuarios/email/" + email + "/", {
          withCredentials: true,
        })
        .then((response) => {
          const rutas = response.data.rutas;
          if (rutas) {
            //console.log(rutas);
            setRutas(rutas);
          }
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

  const hadleSelectRoute = (row) => {
    axios
      .get(
        BACKEND_URL + "/db-manager/trayectorias/?id_ruta=" + row.id_ruta + "/",
        { withCredentials: true }
      )
      .then((response) => {
        if (response) {
          setDataTrayectoria(response.data[0]);
          console.log(dataTrayectoria);

          axios
            .get(
              BACKEND_URL +
                "/db-manager/orden-trayectorias/?id_trayectoria=" +
                dataTrayectoria.id_trayectoria +
                "/",
              { withCredentials: true }
            )
            .then((res) => {
              if (res) {
                setOrdenTrayectoria(res.data);
                console.log(ordenTrayectoria);
                if (ordenTrayectoria.length > 0) {
                  setDataExist(true);
                }
              }
            })
            .catch((error) => {
              console.error("Error al obtener orden de la trayectoria:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos de la trayectoria:", error);
      });
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
        <ReadList
          columns={columns}
          rows={rutas}
          height={550}
          onClickFunction={hadleSelectRoute}
        />
        {dataExist ? (
          <VerRuta
            width="100%"
            height="250px"
            ordenTrayectoria={ordenTrayectoria}
          />
        ) : (
          <VerRuta width="100%" height="250px" />
        )}
      </Box>
    </Container>
  );
}
