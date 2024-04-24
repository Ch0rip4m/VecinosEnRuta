import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"
import Register from "./pages/Register";
import Login from "./pages/Login";
import RecuperarCont from "./pages/RecuperarCont";
import Inicio from "./pages/Inicio";
import MiPerfil from "./pages/MiPerfil";
import MisRutas from "./pages/MisRutas";
import MisViajes from "./pages/MisViajes";
import MiVehiculo from "./pages/MiVehiculo";
import MisChats from "./pages/MisChats";
import Comunidades from "./pages/Comunidades";
import PersistentDrawerLeft from "./components/navBar";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn")
  );

  useEffect(
    () => {
      console.log("isLoggedIn", isLoggedIn);
      console.log("localStorage", localStorage);
    },
    [isLoggedIn],
    [localStorage]
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenPayload = jwtDecode(token);
        const expiration = tokenPayload.exp * 1000;
        const currentTime = new Date().getTime();
        if (currentTime < expiration) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        setIsLoggedIn(false);
        localStorage.removeItem('token');
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  

  const renderRoutes = () => {
    if (isLoggedIn) {
      return (
        <PersistentDrawerLeft>
          <Routes>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/mi-perfil" element={<MiPerfil />} />
            <Route path="/mis-rutas" element={<MisRutas />} />
            <Route path="/mis-viajes" element={<MisViajes />} />
            <Route path="/mis-chats" element={<MisChats />} />
            <Route path="/mi-vehiculo" element={<MiVehiculo />} />
            <Route path="/comunidades" element={<Comunidades />} />
            <Route path="*" element={<Navigate to="/inicio" />} />
          </Routes>
        </PersistentDrawerLeft>
      );
    } else {
      return (
        <Routes>
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar-pass" element={<RecuperarCont />} />
          {/* Redirige al inicio de sesión si no está autenticado */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      );
    }
  };

  return <BrowserRouter>{renderRoutes()}</BrowserRouter>;
}
