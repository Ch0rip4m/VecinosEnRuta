import { BACKEND_URL } from "./Utils/Variables";
import { Route, Routes, Navigate } from "react-router-dom";
import React, { useState } from "react";
import Register from "./pages/login/Register";
import Login from "./pages/login/Login";
import RecuperarCont from "./pages/login/RecuperarCont";
import Inicio from "./pages/home/Inicio";
import MiPerfil from "./pages/perfiles/MiPerfil";
import MisRutas from "./pages/rutas/MisRutas";
import MisViajes from "./pages/rutas/MisViajes";
import MiVehiculo from "./pages/perfiles/MiVehiculo";
import Comunidades from "./pages/comunidades/Comunidades";
import PersistentDrawerLeft from "./components/navbar/navBar";
import ManageAccess from "./components/controlAcceso/ManageAccess";

export default function App() {
  const [checkTokens, setCheckTokens] = useState(null); // Inicializa en null para manejar el estado de carga

  return (
    <div>
      {checkTokens !== null && checkTokens && <ManageAccess Component={PersistentDrawerLeft} setCheckTokens={setCheckTokens} />} {/* Renderiza el drawer solo si los tokens están verificados */}
      <Routes>
        {checkTokens === false ? (
          // Rutas públicas
          <>
            <Route path="/login" element={<Login setCheckTokens={setCheckTokens} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recuperar-pass" element={<RecuperarCont />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          // Rutas protegidas
          <>
            <Route path="/inicio" element={<ManageAccess Component={Inicio} setCheckTokens={setCheckTokens} />} />
            <Route path="/mi-perfil" element={<ManageAccess Component={MiPerfil} setCheckTokens={setCheckTokens} />} />
            <Route path="/mis-rutas" element={<ManageAccess Component={MisRutas} setCheckTokens={setCheckTokens} />} />
            <Route path="/mis-viajes" element={<ManageAccess Component={MisViajes} setCheckTokens={setCheckTokens} />} />
            <Route path="/mi-vehiculo" element={<ManageAccess Component={MiVehiculo} setCheckTokens={setCheckTokens} />} />
            <Route path="/comunidades" element={<ManageAccess Component={Comunidades} setCheckTokens={setCheckTokens} />} />
            <Route path="*" element={<Navigate to="/inicio" />} />
          </>
        )}
      </Routes>
    </div>
  );
}
