import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../../Utils/Variables";
import { Avatar, Button, Container, TextField, Box, Grid } from "@mui/material";
import MultipleSelectChip from "../../../components/selectores/MultiSelector";

const csrfToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("csrftoken="))
  ?.split("=")[1];

export default function MiPerfil() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    //id_usuario: 0,
    nombre_usuario: "",
    apellido_usuario: "",
    email: "",
    telefono: "",
    nombre_rol: [],
    descripcion_usuario: "",
    imagen_perfil: "",
  });

  useEffect(() => {
    console.log("USER", user);
  }, [user]);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      axios
        .get(BACKEND_URL + "/db-manager/usuarios/email/" + email + "/", {
          withCredentials: true,
        })
        .then((response) => {
          console.log("respuesta:", response.data);
          const usuario = response.data.usuario;
          const roles = response.data.roles;
          setUser({
            nombre_usuario: usuario.nombre_usuario,
            apellido_usuario: usuario.apellido_usuario,
            email: usuario.email,
            telefono: usuario.telefono,
            nombre_rol: roles,
            descripcion_usuario: usuario.descripcion_usuario,
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

  const handleDataChange = (event, name) => {
    setUser({ ...user, [name]: event });
  };

  // Función para manejar el cambio en los campos editables
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Función para manejar el envío del formulario de edición
  const handleSubmit = (e) => {
    e.preventDefault();

    const user_id = localStorage.getItem("user_id");
    console.log(user_id);

    const updatedUser = { ...user };
    console.log("updatedUSER", updatedUser);
    delete updatedUser.imagen_perfil;

    axios
      .put(`${BACKEND_URL}/db-manager/usuarios/${user_id}/`, updatedUser, {
        headers: { "X-CSRFToken": csrfToken }, // OJO AQUI
        withCredentials: true, // Asegúrate de enviar cookies con la solicitud
      })
      .then((response) => {
        console.log("Datos Actualizados", response.data);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error al acualizar", error);
      });
    // Aquí puedes enviar los datos actualizados del usuario a tu servidor
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
            sx={{ "&:hover": { bgcolor: "red" } }}
            onClick={() => setIsEditing(false)}
          >
            Cancelar Edición
          </Button>
        ) : (
          <Button
            variant="contained"
            sx={{
              bgcolor: "var(--navbar-color)",
              "&:hover": { bgcolor: "var(--navbar-color)" },
            }}
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
          <Grid item xs={12}>
            <MultipleSelectChip
              fullWidth
              label="Roles"
              name="nombre_rol"
              formData={user}
              values={["Pasajero", "Conductor"]}
              onChange={handleDataChange}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion_usuario"
              value={user.descripcion_usuario}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
        {isEditing && (
          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: "var(--navbar-color)" }}
          >
            Guardar Cambios
          </Button>
        )}
      </Box>
    </Container>
  );
}
