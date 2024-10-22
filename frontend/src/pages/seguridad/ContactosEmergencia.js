import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Grid,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import axios from "axios";
import { BACKEND_URL } from "../../Utils/Variables";

const csrfToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("csrftoken="))
  ?.split("=")[1];

export default function Contactos(props) {
  const [formData, setformData] = useState({});

  useEffect(() => {
    console.log("formData:", formData);
  }, [formData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSend = {
      ...formData,
      id_usuario: localStorage.getItem("user_id"),
    };

    console.log(formDataToSend);

    await axios
      .post(BACKEND_URL + "/db-manager/contactos-emergencia/", formDataToSend, {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true, // Si necesitas enviar cookies
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("error al ingresar correos de emergencia", error);
      });
  };

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setformData({ ...formData, [name]: value });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="overline"
          sx={{ mt: 1, mb: 2, textAlign: "center" }}
        >
          Aqui puedes ingresar los correos electronicos de tus contactos de
          emergencia
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "100%", textAlign: "center" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                value={formData.correo || null}
                name="correo_emergencia"
                fullWidth
                onChange={handleTextChange}
                label="Escriba los correos separandolos por comas"
                maxRows={5}
                multiline
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, mb: 2, bgcolor: "var(--navbar-color)" }}
          >
            Guardar contactos
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
