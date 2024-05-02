import React, { useState } from "react";
import {
  Avatar,
  Button,
  Container,
  TextField,
  Typography,
  Box
} from "@mui/material";

export default function MiVehiculo() {
  // Datos de ejemplo para el usuario
  const [user, setUser] = useState({
    name: "Nombre del Usuario",
    email: "usuario@example.com",
    phone: "123456789",
    role: "Rol del Usuario",
    community: "Comunidad del Usuario",
    description: "Descripción del Usuario",
    // URL de la foto de perfil del usuario
    avatarUrl: "https://example.com/avatar.png",
  });

  // Estado para controlar si se está editando el perfil o no
  const [isEditing, setIsEditing] = useState(false);

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
    <Container maxWidth="sm">
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
        <Avatar
          alt={user.name}
          src={user.avatarUrl}
          style={{ width: "100px", height: "100px", margin: "0 auto" }}
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
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nombre"
          name="name"
          value={user.name}
          onChange={handleChange}
          disabled={!isEditing}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={user.email}
          onChange={handleChange}
          disabled={!isEditing}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Teléfono"
          name="phone"
          value={user.phone}
          onChange={handleChange}
          disabled={!isEditing}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Rol"
          name="role"
          value={user.role}
          onChange={handleChange}
          disabled={!isEditing}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Comunidad"
          name="community"
          value={user.community}
          onChange={handleChange}
          disabled={!isEditing}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Descripción"
          name="description"
          value={user.description}
          onChange={handleChange}
          disabled={!isEditing}
          margin="normal"
          multiline
          rows={4}
        />
        {isEditing && (
          <Button type="submit" variant="contained" color="primary">
            Guardar Cambios
          </Button>
        )}
      </form>
    </Container>
  );
}
