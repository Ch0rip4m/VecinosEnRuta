import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../Utils/Variables";
import axios from "axios";

export default function Solicitudes() {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    axios
      .get(
        BACKEND_URL +
          "/db-manager/mostrar-solicitudes/" +
          localStorage.getItem("user_id") +
          "/",
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        setNotificaciones(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las notificaciones:", error);
      });
  }, []);

  return (
    <div>
      <h2>Mis Notificaciones</h2>
      <ul>
        {notificaciones.map((notificacion) => (
          <li key={notificacion.id}>
            {notificacion.mensaje} - {notificacion.leido ? "Leído" : "No leído"}
          </li>
        ))}
      </ul>
    </div>
  );
}
