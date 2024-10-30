import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../Utils/Variables";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import SelectorSearch from "../../components/selectores/SelectorSearch";
import UbicarComunidad from "../../components/mapas/UbicarComunidad";
import { useSnackbar } from "../../contexts/SnackbarContext";

const csrfToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("csrftoken="))
  ?.split("=")[1];

function GetSelectorData(tableRequest) {
  // función para obtener la data para componentes especificos, retorna una lista de strings
  const [values, setValues] = useState([]);

  useEffect(() => {
    axios
      .get(BACKEND_URL + "/db-manager/" + tableRequest + "/", {
        withCredentials: true,
      })
      .then((response) => {
        if (tableRequest === "comunas") {
          const getComunas = response.data.map((item) => item.nombre_comuna);
          setValues(getComunas);
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  }, []);
  return values;
}

export default function CrearComunidad() {
  const [formData, setformData] = useState({});
  const [ubicacion, setUbicacion] = useState({});
  const comunas = GetSelectorData("comunas");
  const snackbar = useSnackbar()

  useEffect(() => {
    console.log("formData: ", formData);
    console.log("ubicacion: ", ubicacion);
  }, [formData, ubicacion]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user_id = localStorage.getItem("user_id");

    const formDataToSend = {
      ...formData,
      id_usuario: user_id,
      latitud: ubicacion.lat,
      longitud: ubicacion.lon,
    };
    console.log(formDataToSend);

    await axios
      .post(BACKEND_URL + "/db-manager/comunidades/", formDataToSend, {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      })
      .then((response) => {
        console.log("Comunidad creada exitosamente", response.data);
        snackbar.success("Comunidad creada exitosamente");
        setTimeout(() => {
          window.location.href = "/comunidades";
        }, 2000); 
      })
      .catch((error) => {
        console.error("Error al ingresar la comunidad", error);
        snackbar.error("Error al crear la comunidad")
      });
  };

  const handleDataChange = (event, name) => {
    setformData({ ...formData, [name]: event });
  };

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setformData({ ...formData, [name]: value });
  };

  // Función para recibir las coordenadas desde el componente hijo
  const handleCoordinatesChange = (coords) => {
    setUbicacion(coords);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="overline" sx={{}}>
          ¡Ingresa los datos de tu comunidad!
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={12}>
              <TextField
                value={formData.nombre_comunidad || ""}
                name="nombre_comunidad"
                required
                fullWidth
                onChange={handleTextChange}
                label="Nombre de la Comunidad"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SelectorSearch
                values={comunas}
                required
                fullWidth
                formData={formData}
                onChange={handleDataChange}
                label="Comuna"
                name="nombre_comuna"
              />
            </Grid>
          </Grid>
          <UbicarComunidad
            width="100%"
            height="250px"
            onCoordinatesChange={handleCoordinatesChange} // Pasar la función al hijo
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: "var(--navbar-color)" }}
          >
            Crear comunidad
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
