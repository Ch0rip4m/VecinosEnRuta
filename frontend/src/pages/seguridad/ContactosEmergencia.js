import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Grid,
  Button,
  Typography,
  TextField,
  Tabs,
  Tab,
} from "@mui/material";
import axios from "axios";
import { BACKEND_URL } from "../../Utils/Variables";
import MultipleSelectChip from "../../components/selectores/MultiSelector";

const csrfToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("csrftoken="))
  ?.split("=")[1];

export default function Contactos(props) {
  const [formData, setFormData] = useState({});
  const [selectContacts, setSelectContacts] = useState({});
  const [contacts, setContacts] = useState([]);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(value);
  };

  useEffect(() => {
    console.log("formData:", formData);
  }, [formData]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/db-manager/contactos-usuario/`, {
        params: { id_usuario: localStorage.getItem("user_id") },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        const getContacts = response.data.map((item) => item.correo_emergencia);
        setContacts(getContacts);
      })
      .catch((error) => {
        console.error("Error al obtener los correos de confianza", error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSend = {
      ...formData,
      id_usuario: localStorage.getItem("user_id"),
    };

    console.log(formDataToSend);

    await axios
      .post(`${BACKEND_URL}/db-manager/contactos-emergencia/`, formDataToSend, {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error al ingresar correos de emergencia", error);
      });
  };

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDataChange = (event, name) => {
    setSelectContacts({ ...selectContacts, [name]: event });
  };

  const handleShareLocation = () => {};

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Tabs value={value} onChange={handleChange} variant="scrollable">
          <Tab label="Contactos" />
          <Tab label="Botón de pánico" />
          <Tab label="Compartir ubicación" />
        </Tabs>
        <Box sx={{ mt: 2, width: "100%", textAlign: "center" }}>
          {value === 0 && (
            <>
              <Typography
                variant="overline"
                sx={{ mt: 1, mb: 1, textAlign: "center" }}
              >
                Aquí puedes ingresar los correos electrónicos de tus contactos
                de emergencia
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    value={formData.correo || ""}
                    name="correo_emergencia"
                    fullWidth
                    onChange={handleTextChange}
                    label="Escriba los correos separándolos por comas"
                    maxRows={5}
                    multiline
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2, mb: 2, bgcolor: "var(--navbar-color)" }}
                onClick={handleSubmit}
              >
                Guardar contactos
              </Button>
            </>
          )}
          {value === 1 && (
            <>
              <Typography variant="overline" sx={{ mt: 2 }}>
                En caso de que te sientas incómodo en tu viaje, presiona este
                botón.
              </Typography>
              <Grid container spacing={2} sx={{mt:2}}>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    sx={{ mt: 2, mb: 2, padding:10, bgcolor: "red" }}
                    onClick={handleShareLocation}
                  >
                    botón de pánico
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
          {value === 2 && (
            <>
              <Typography
                variant="overline"
                sx={{ mt: 1, mb: 1, textAlign: "center" }}
              >
                Aquí puedes elegir contacto a los que les compartiras ubicación
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <MultipleSelectChip
                    values={contacts}
                    formData={selectContacts}
                    onChange={handleDataChange}
                    required
                    fullWidth
                    label="¿A quién deseas compartir ubicación?"
                    name="correo_emergencia"
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                sx={{ mt: 2, mb: 2, bgcolor: "var(--navbar-color)" }}
                onClick={handleShareLocation}
              >
                Compartir Ubicación
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}
