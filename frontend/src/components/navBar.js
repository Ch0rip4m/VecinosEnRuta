import "../styles/navBar.css";
import React, { useState, useEffect } from "react";
import { BACKEND_URL } from "../Utils/Variables";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import MinorCrashIcon from "@mui/icons-material/MinorCrash";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import ChatIcon from "@mui/icons-material/Chat";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import LogoRedondoVER from "../styles/LogoRedondo";
import axios from "axios";
import { Avatar } from "@mui/material";

const csrfToken = document.cookie.split('; ')
  .find(row => row.startsWith('csrftoken='))
  ?.split('=')[1];

const elements = [
  { name: "Inicio", icon: <HomeIcon />, url: "/inicio" },
  { name: "Mi Perfil", icon: <AccountBoxIcon />, url: "/mi-perfil" },
  { name: "Mis Rutas", icon: <AltRouteIcon />, url: "/mis-rutas" },
  { name: "Mi Vehículo", icon: <MinorCrashIcon />, url: "/mi-vehiculo" },
  { name: "Mis Viajes", icon: <EditCalendarIcon />, url: "/mis-viajes" },
  { name: "Mis Chats", icon: <ChatIcon />, url: "/mis-chats" },
  { name: "Comunidades", icon: <PeopleIcon />, url: "/comunidades" },
];

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedElementName, setSelectedElementName] = React.useState(() => {
    // Intenta recuperar el elemento seleccionado del almacenamiento local
    const storedSelectedElement = localStorage.getItem("selectedElementName");
    return storedSelectedElement ? storedSelectedElement : "Inicio"; // Si no hay nada en el almacenamiento local, establece el valor predeterminado como "Inicio"
  });
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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogOut = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/logout/`, {}, { headers: {'X-CSRFToken': csrfToken}, //OJO AQUI
          withCredentials: true,  // Asegúrate de enviar cookies con la solicitud
      });
      if (response.status === 204) {
          // Redirige o realiza alguna otra acción después de un logout exitoso
          window.location.href = '/login';
      } else {
          console.error('Logout failed');
      }
  } catch (error) {
      console.error('An error occurred during logout', error);
  }

  };

  const handleElementSelect = (element) => {
    setSelectedElementName(element.name);
    localStorage.setItem("selectedElementName", element.name); // Guarda el elemento seleccionado en el almacenamiento local
    window.location.href = element.url;
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      axios
        .get(BACKEND_URL + "/db-manager/usuarios/email/" + email + "/", { withCredentials:true})
        .then((response) => {
          //console.log("respuesta:", response.data);
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
          console.log(user.roles);
        })
        .catch((error) =>
          console.error("Error al obtener los datos del usuario:", error)
        );
    }
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ bgcolor: "var(--navbar-color)" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            {selectedElementName}
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleLogOut}
            sx={{ ...(open && { display: "none" }) }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "var(--navbar-color)",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader sx={{ bgcolor: "var(--navbar-color)" }}>
          <Avatar
            src={user.imagen_perfil}
            alt={user.nombre_usuario}
            sx={{ mr: 3, mt: 1 }}
          />
          <Box sx={{mt:2, flexDirection: "column", display: "flex", color:"white", fontSize: 12}}>
            {user.nombre_usuario} {user.apellido_usuario} <br />{user.roles}
          </Box>
          <IconButton onClick={handleDrawerClose} sx={{ color: "white" }}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <List sx={{ bgcolor: "var(--navbar-color)" }}>
          {elements.map((element, index) => (
            <ListItem
              key={element.name}
              sx={{ bgcolor: "var(--navbar-color)" }}
            >
              <ListItemButton onClick={() => handleElementSelect(element)}>
                <div className="navBar-row-elemnts">
                  <ListItemIcon sx={{ color: "white" }}>
                    {element.icon}
                  </ListItemIcon>
                  <ListItemText primary={element.name} />
                </div>
              </ListItemButton>
            </ListItem>
          ))}
          <LogoRedondoVER width="235px" height="200px" />
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}
