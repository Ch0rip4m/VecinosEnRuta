import { BrowserRouter, Route, Routes } from "react-router-dom";
import Inicio from "./pages/Inicio";
import MiPerfil from "./pages/MiPerfil";
import MisRutas from "./pages/MisRutas";
import MisViajes from "./pages/MisViajes";
import MiVehiculo from "./pages/MiVehiculo";
import MisChats from "./pages/MisChats";
import Comunidades from "./pages/Comunidades";
import PersistentDrawerLeft from "./components/navBar";

export default function App() {
  return (
    <BrowserRouter>
    <PersistentDrawerLeft />
      <Routes>
        <Route path="/" element={<Inicio/>}/>
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
