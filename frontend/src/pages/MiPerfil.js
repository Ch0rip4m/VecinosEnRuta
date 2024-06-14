import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../Utils/Variables";
import { Avatar, Button, Container, TextField, Box, Grid } from "@mui/material";

export default function MiPerfil() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    nombre_usuario: "",
    apellido_usuario: "",
    email: "",
    telefono: "",
    roles: "",
    comunidad: "",
    descripcion: "",
    imagen_perfil: "",
  });

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      axios
        .get(BACKEND_URL + "/db-manager/usuarios/email/" + email + "/")
        .then((response) => {
          console.log("respuesta:", response.data);
          const usuario = response.data.usuario;
          const roles = response.data.roles;
          const comunidad = response.data.comunidad;
          setUser({
            nombre_usuario: usuario.nombre_usuario,
            apellido_usuario: usuario.apellido_usuario,
            email: usuario.email,
            telefono: usuario.telefono,
            roles: roles.join(", "),
            comunidad: comunidad[0] || "",
            descripcion: usuario.descripcion_usuario,
            imagen_perfil:
              BACKEND_URL + usuario.imagen_perfil ||
              "https://example.com/avatar.png",
          });
        })
        .catch((error) =>
          console.error("Error al obtener los datos del usuario:", error)
        );
    }
  }, []);

  // Función para manejar el cambio en los campos editables
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
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
          alt={user.nombre_usuario}
          src={user.imagen_perfil}
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
            Editar Perfil
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
              label="Nombre"
              name="nombre_usuario"
              value={user.nombre_usuario}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellido"
              name="apellido_usuario"
              value={user.apellido_usuario}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teléfono"
              name="telefono"
              value={user.telefono}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Roles"
              name="roles"
              value={user.roles}
              onChange={handleChange}
              disabled
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Comunidad"
              name="comunidad"
              value={user.comunidad}
              onChange={handleChange}
              disabled
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion_usuario"
              value={user.descripcion}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
              multiline
              rows={4}
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
