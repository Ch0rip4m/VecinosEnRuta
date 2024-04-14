import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React, {useState} from "react";
import Register from "./pages/Register"
import Login from "./pages/Login"
import RecuperarCont from "./pages/RecuperarCont"
import Inicio from "./pages/Inicio";
import MiPerfil from "./pages/MiPerfil";
import MisRutas from "./pages/MisRutas";
import MisViajes from "./pages/MisViajes";
import MiVehiculo from "./pages/MiVehiculo";
import MisChats from "./pages/MisChats";
import Comunidades from "./pages/Comunidades";
import PersistentDrawerLeft from "./components/navBar";

export default function App() {
  const [isLoggedIn, setIsloggedIn] = useState(false)
  
  return (
    <BrowserRouter>
      {isLoggedIn && <PersistentDrawerLeft />}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/inicio"/> : <Navigate to="/login"/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/recuperar-pass" element={<RecuperarCont/>}/>
        <Route path="/inicio" element={<Inicio/>}/>
        <Route path="/mi-perfil" element={<MiPerfil/>}/>
        <Route path="/mis-rutas" element={<MisRutas/>}/>
        <Route path="/mis-viajes" element={<MisViajes/>}/>
        <Route path="/mis-chats" element={<MisChats/>}/>
        <Route path="/mi-vehiculo" element={<MiVehiculo/>}/>
        <Route path="/comunidades" element={<Comunidades/>}/>
      </Routes>
    </BrowserRouter>
  ) 
}
