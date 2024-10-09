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
import MultipleSelectChip from "../../components/selectores/MultiSelector";
import SelectorSearch from "../../components/selectores/SelectorSearch";
import DrawMap from "../../components/mapas/DibujarRuta";

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
        if (tableRequest === "dias") {
          const getDias = response.data.map((item) => item.nombre_dia);
          setValues(getDias);
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  }, []);
  return values;
}

export default function CrearRuta() {
  const [formData, setformData] = useState({});
  const comunas = GetSelectorData("comunas");
  const dias = GetSelectorData("dias");

  useEffect(() => {
    console.log("formData: ", formData);
  }, [formData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user_id = localStorage.getItem("user_id");
    const car_id = localStorage.getItem("car_id");

    const formDataToSend = {
      ...formData,
      id_conductor: user_id,
      id_vehiculo: car_id,
    };
    console.log(formDataToSend);

    await axios
      .post(BACKEND_URL + "/db-manager/rutas/", formDataToSend, {
        headers: { "X-CSRFToken": csrfToken }, // OJO AQUI
        withCredentials: true, // Asegúrate de enviar cookies con la solicitud
      })
      .then((response) => {
        console.log("Ruta creada exitosamente", response.data);
      })
      .catch((error) => {
        console.error("Error al ingresar la ruta", error);
      });
  };

  const handleDataChange = (event, name) => {
    setformData({ ...formData, [name]: event });
  };

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setformData({ ...formData, [name]: value });
  };

  const handleHourText = (event) => {
    const { name, value } = event.target;
    // Permitir solo números y el carácter ":"
    const inputValue = value.replace(/[^0-9:]/g, "");

    // Validar que la hora esté en un formato parcial válido
    const isPartialTime = /^([0-9]{0,2}):?([0-9]{0,2})?$/.test(inputValue);

    if (isPartialTime) {
      setformData((currentData) => ({ ...currentData, [name]: inputValue }));
    }
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
          ¡Ingresa los datos de tu ruta!
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={12}>
              <TextField
                value={formData.nombre_ruta || null}
                name="nombre_ruta"
                required
                fullWidth
                onChange={handleTextChange}
                label="Nombre de la ruta"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SelectorSearch
                values={comunas}
                required
                fullWidth
                formData={formData}
                onChange={handleDataChange}
                label="Origen"
                name="origen"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SelectorSearch
                values={comunas}
                required
                fullWidth
                formData={formData}
                onChange={handleDataChange}
                label="Destino"
                name="destino"
              />
            </Grid>
            <Grid item xs={12}>
              <MultipleSelectChip
                values={dias}
                formData={formData}
                onChange={handleDataChange}
                required
                fullWidth
                label="¿Qué día(s) se hara la ruta?"
                name="nombre_dia"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={formData.hora_salida || ""}
                required
                fullWidth
                onChange={handleHourText}
                label="Hora de salida"
                name="hora_salida"
              />
            </Grid>
          </Grid>
          <Typography
            component="h1"
            variant="overline"
            sx={{ textAlign: "center" }}
          >
            ¡Dibuja la ruta dentro de la comuna!
          </Typography>
          <DrawMap width="100%" height="250px" />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: "var(--navbar-color)" }}
          >
            Guardar ruta
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
