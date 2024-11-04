import { Button, Container, Box, Grid } from "@mui/material";
import ReadList from "../../components/listas/ListaLectura";
import VerRuta from "../../components/mapas/VerRuta";
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../Utils/Variables";
import axios from "axios";
import SelectorSearch from "../../components/selectores/SelectorSearch";
import SimpleSelectLocation from "../../components/selectores/SimpleSelectLocation";
import { format } from "ol/coordinate";

const columns = [
  { id: "nombre_ruta", label: "Nombre" },
  { id: "origen", label: "Origen" },
  { id: "destino", label: "Destino" },
  { id: "dias", label: "Días" },
  { id: "hora_salida", label: "Salida" },
];

const columnsMembers = [
  { id: "nombre_usuario", label: "Nombre" },
  { id: "telefono", label: "Telefono" },
];

export default function MisRutas() {
  const [rutas, setRutas] = useState([]);
  const [nombresRutas, setNombresRutas] = useState([]);
  const [dataMembers, setDataMembers] = useState([]);
  const [ordenTrayectoria, setOrdenTrayectoria] = useState([]);
  const [dataExist, setDataExist] = useState(false);
  const [formData, setformData] = useState({});

  useEffect(() => {
    console.log(formData);
  }, [formData]);

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
            const getNames = rutas.map((item) => ({
              label: item.nombre_ruta,
              value: item.id_ruta,
            }));
            setNombresRutas(getNames);
            setRutas(rutas);
          }
        })
        .catch((error) =>
          console.error("Error al obtener los datos del usuario:", error)
        );
    }
  }, []);

  const handleDataChange = (event, name) => {
    setformData({ ...formData, [name]: event });
  };

  const handleButtonCreate = () => {
    window.location.href = "/mis-rutas/crear";
  };

  const handleButtonEdit = () => {
    window.location.href = "/mis-rutas/editar";
  };

  const handleInfoMembers = () => {
    axios
      .get(BACKEND_URL + "/db-manager/miembros-ruta/", {
        params: { id_ruta: formData.nombre_ruta.value },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setDataMembers(response.data);
      })
      .catch((error) => {
        console.error("error al obtener los datos", error);
      });
  };

  useEffect(() => {
    console.log(dataMembers);
  }, [dataMembers]);

  const hadleSelectRoute = (row) => {
    axios
      .get(BACKEND_URL + "/db-manager/mostrar-ruta/", {
        params: { id_ruta: row.id_ruta },
        withCredentials: true,
      })
      .then((response) => {
        if (response) {
          setOrdenTrayectoria(response.data);
          console.log(ordenTrayectoria);
          if (ordenTrayectoria.length > 0) {
            setDataExist(true);
          }
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
          height={150}
          onClickFunction={hadleSelectRoute}
        />
        {dataExist ? (
          <VerRuta
            width="100%"
            height="300px"
            ordenTrayectoria={ordenTrayectoria}
          />
        ) : (
          <VerRuta width="100%" height="300px" />
        )}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6} sm={6}>
            <SimpleSelectLocation
              required
              fullWidth
              label="Miembros de ruta"
              name="nombre_ruta"
              values={nombresRutas}
              onChange={handleDataChange}
              formData={formData}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={handleInfoMembers}
            >
              ver miembros
            </Button>
          </Grid>
        </Grid>
        <ReadList columns={columnsMembers} rows={dataMembers} height={150} />
      </Box>
    </Container>
  );
}
