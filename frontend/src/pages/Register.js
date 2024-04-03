import { useState } from 'react'
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from 'axios'
import SimpleSelector from '../components/SimpleSelector';

const requiredFields = [
  "descripcion",
  "nombre",
  "apellido",
  "telefono",
  "sexo",
  "password",
  "email",
  "sponsor",
  "edad"
];

export default function Register() {
  const [formData, setformData] = useState({});
  const [submitEnabled, setSubmitEnabled] = useState(false);

  const handleFormReady = () => {
    if (isFormReady(requiredFields)) {
      setSubmitEnabled(true);
      handleSubmit();
    }
  };

  const handleSubmit = async (event) => {
    event ? event.preventDefault() : null;
    if (submitEnabled === false) {
      return false;
    }
    await axios
      .post("http://localhost:8080/")
  };

  const isFormReady = (required) => {
    const requiredFieldsRedy = required;
    const formDataValid = requiredFieldsRedy.every((field) => {
      if (formData[field] == null) {
        return false;
      }
    });
    return formDataValid;
  };

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setformData({ ...formData, [name]: value });
  };

  const handleNumericText = (event) => {
    const { name, value } = event.target;
    const inputValue = value.replace(/[^0-9]/g, "");
    setformData((currentData) => ({ ...currentData, [name]: inputValue }));
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m:1,bgcolor: "secondary.main" }}>
          <HowToRegIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registro de nuevo vecino!
        </Typography>
        <Box component="form" noValidate id="register-form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.nombre || null}
                name="nombre"
                required
                fullWidth
                id="nombre"
                onChange={handleTextChange}
                label="Nombre(s)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.Apellido || null}
                required
                fullWidth
                id="apellido"
                onChange={handleTextChange}
                label="Apellidos"
                name="apellido"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.edad || ""}
                required
                fullWidth
                id="edad"
                onChange={handleNumericText}
                label="Edad"
                name="edad"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SimpleSelector
                values={["Masculino","Femenino","Prefiero no decir"]}
                formData={formData}
                required
                fullWidth
                id="sexo"
                label="Sexo"
                name="sexo"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={formData.telefono || ""}
                required
                fullWidth
                id="telefono"
                onChange={handleNumericText}
                label="Celular"
                name="telefono"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={formData.email || null}
                required
                fullWidth
                id="email"
                onChange={handleTextChange}
                label="Correo Electrónico"
                name="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={formData.password || null}
                required
                fullWidth
                onChange={handleTextChange}
                name="password"
                label="Contraseña"
                type="password"
                id="password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={formData.descripcion || null}
                required
                fullWidth
                onChange={handleTextChange}
                multiline
                maxRows='5'
                name="descripcion"
                label="¡Describe como eres! (lo que te gusta y no)"
                id="descripcion"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={(event) => handleFormReady(event)}
          >
            Registrarse
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
