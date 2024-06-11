import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../Utils/Variables";
import { Avatar, Button, Container, TextField, Box, Grid } from "@mui/material";

export default function MiPerfil() {
  const [isEditing, setIsEditing] = useState(false);
  const [carData, setCarData] = useState({
    marca_vehiculo: "",
    modelo_vehiculo: "",
    tipo_de_vehiculo: "",
    nro_asientos_disp: "",
    color_vehiculo: "",
    patente: "",
    ano_vehiculo: "",
    avatarUrl: "https://example.com/avatar.png",
  });

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      axios
        .get(BACKEND_URL + "/db-manager/usuarios/email/" + email + "/")
        .then((response) => {
          console.log("respuesta:", response.data);
          const vehiculo = response.data.vehiculo;
          setCarData(vehiculo);
        })
        .catch((error) =>
          console.error("Error al obtener los datos del usuario:", error)
        );
    }
  }, []);

  // Función para manejar el cambio en los campos editables
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarData({ ...carData, [name]: value });
  };

  // Función para manejar el envío del formulario de edición
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar los datos actualizados del usuario a tu servidor
    setIsEditing(false);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Avatar
          alt={carData.marca_vehiculo}
          src={carData.avatarUrl}
          style={{ width: "100px", height: "100px", marginBottom: "15px" }}
        />
        {isEditing ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsEditing(false)}
          >
            Cancelar Edición
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsEditing(true)}
          >
            Editar vehículo
          </Button>
        )}
      </Box>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid container spacing={1} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Marca"
              name="marca_vehiculo"
              value={carData.marca_vehiculo}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Modelo"
              name="modelo_vehiculo"
              value={carData.modelo_vehiculo}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tipo de vehículo"
              name="tipo_de_vehiculo"
              value={carData.tipo_de_vehiculo}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nro de asientos disp."
              name="nro_asientos_disp"
              value={carData.nro_asientos_disp}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Color"
              name="color_vehiculo"
              value={carData.color_vehiculo}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Patente"
              name="patente"
              value={carData.patente}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Año del vehículo"
              name="ano_vehiculo"
              value={carData.ano_vehiculo}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
        </Grid>
        {isEditing && (
          <Button type="submit" variant="contained" color="primary">
            Guardar Cambios
          </Button>
        )}
      </Box>
    </Container>
  );
}
