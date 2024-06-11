import { useState, useEffect } from "react";
import { BACKEND_URL } from "../Utils/Variables";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import SimpleSelector from "../components/SimpleSelector";
import MultipleSelectChip from "../components/MultiSelector";

export default function Register() {
  const [formData, setformData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    console.log("formData: ",formData)
  }, [formData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requiredFields = [
      "nombre_usuario",
      "apellido_usuario",
      "edad",
      "telefono",
      "email",
      "password",
      "sexo",
      "nombre_rol",
      "descripcion_usuario"
    ];
    const errors = {};
    let hasErrors = false;

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = "Este campo es obligatorio";
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setFormErrors(errors);
    } else {
      await axios
        .post(BACKEND_URL + "/db-manager/usuarios/", formData)
        .then((response) => {
          console.log("formulario enviado", response.data);
        })
        .catch((error) => {
          console.error("Error al enviar formulario", error)
        })
    }
  };

  const handleDataChange = (event, name) => {
    setformData({ ...formData, [name]: event });
    setFormErrors({ ...formErrors, [name]: null });
  };

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setformData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: null });
  };

  const handleNumericText = (event) => {
    const { name, value } = event.target;
    const inputValue = value.replace(/[^0-9]/g, "");
    setformData((currentData) => ({ ...currentData, [name]: inputValue }));
    setFormErrors({ ...formErrors, [name]: null });
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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <HowToRegIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registro de nuevo vecino!
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.nombre_usuario || null}
                name="nombre_usuario"
                required
                fullWidth
                onChange={handleTextChange}
                label="Nombre(s)"
                error={Boolean(formErrors.nombre_usuario)}
                helperText={formErrors.nombre_usuario}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.apellido_usuario || null}
                required
                fullWidth
                onChange={handleTextChange}
                label="Apellidos"
                name="apellido_usuario"
                error={Boolean(formErrors.apellido_usuario)}
                helperText={formErrors.apellido_usuario}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={formData.edad || ""}
                required
                fullWidth
                onChange={handleNumericText}
                label="Edad"
                name="edad"
                error={Boolean(formErrors.edad)}
                helperText={formErrors.edad}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SimpleSelector
                values={["Masculino", "Femenino", "Prefiero no decir"]}
                formData={formData}
                onChange={handleDataChange}
                required
                fullWidth
                label="Sexo"
                name="sexo"
                error={Boolean(formErrors.sexo)}
                helperText={formErrors.sexo}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={formData.telefono || ""}
                required
                fullWidth
                onChange={handleNumericText}
                label="Celular"
                name="telefono"
                error={Boolean(formErrors.telefono)}
                helperText={formErrors.telefono}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={formData.email || null}
                required
                fullWidth
                onChange={handleTextChange}
                label="Correo Electrónico"
                name="email"
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
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
                error={Boolean(formErrors.password)}
                helperText={formErrors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <MultipleSelectChip
                values={["Pasajero", "Conductor"]}
                formData={formData}
                onChange={handleDataChange}
                required
                fullWidth
                label="¿Qué rol(es) tomarias en la app?"
                name="nombre_rol"
                error={Boolean(formErrors.nombre_rol)}
                helperText={formErrors.nombre_rol}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={formData.descripcion_usuario || null}
                required
                fullWidth
                onChange={handleTextChange}
                multiline
                maxRows="5"
                name="descripcion_usuario"
                label="¡Describe como eres! (lo que te gusta y no)"
                error={Boolean(formErrors.descripcion_usuario)}
                helperText={formErrors.descripcion_usuario}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrarse
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
