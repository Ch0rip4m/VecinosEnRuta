import { BACKEND_URL } from "./Utils/Variables";
import { Route, Routes, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
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
import axios from "axios";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn")
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const tokenPayload = jwtDecode(token);
        const expiration = tokenPayload.exp * 1000;
        const currentTime = new Date().getTime();
        if (currentTime < expiration) {
          setIsLoggedIn(true);
        } else {
          refreshAccessToken();
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        logout();
      }
    } else {
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
    }
  }, []);

  const refreshAccessToken = async () => {
    const rtoken = localStorage.getItem("rtoken");
    if (rtoken) {
      try {
        const response = await axios.post(BACKEND_URL + "/auth/refresh/", { refresh: rtoken });
        console.log(response.data)
        const { access } = response.data;
        localStorage.setItem('token', access);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error al refrescar el token de acceso:", error);
        logout();
      }
    } else {
      logout();
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("rtoken");
    localStorage.removeItem("isLoggedIn");
  };

  const renderRoutes = () => {
    if (isLoggedIn) {
      return (
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

  return (
    <div>
      {isLoggedIn && <PersistentDrawerLeft setIsLoggedIn={setIsLoggedIn}/>}
      {renderRoutes()}
    </div>
  );
}
