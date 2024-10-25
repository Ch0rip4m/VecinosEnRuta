import React, { useEffect, useRef } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM } from "ol/source";
import { Vector as VectorSource } from "ol/source";
import { fromLonLat, toLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Style, Icon } from "ol/style";
import { BACKEND_URL } from "../../Utils/Variables";

export default function VisorConductor() {
  const mapRef = useRef();
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const initialPosition = fromLonLat([-70.6483, -33.4569]); // Coordenadas iniciales (ejemplo: Santiago, Chile)

    // Crear el marcador con el ícono del conductor
    const driverMarker = new Feature({
      geometry: new Point(initialPosition),
    });
    driverMarker.setStyle(
      new Style({
        image: new Icon({
          src: BACKEND_URL + "/media/mapas/vehicle.png", // URL del ícono del conductor
          scale: 0.11,
        }),
      })
    );
    const vectorSource = new VectorSource({
      features: [driverMarker],
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Crear el mapa con OpenLayers
    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: initialPosition,
        zoom: 15,
      }),
    });

    // Guardar el marcador en el ref
    markerRef.current = driverMarker;
  }, []);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//         if (markerRef.current && mapInstance.current) {
//             // Obtener la posición actual y convertirla a lon/lat para modificarla
//             const currentCoords = toLonLat(markerRef.current.getGeometry().getCoordinates());
            
//             // Emular un cambio en la posición (aquí moviéndonos ligeramente al noreste)
//             const newCoords = fromLonLat([currentCoords[0] + 0.0001, currentCoords[1] + 0.0001]);

//             // Actualizar la posición del marcador y centrar el mapa en la nueva posición
//             markerRef.current.getGeometry().setCoordinates(newCoords);
//             mapInstance.current.getView().setCenter(newCoords);
//         }
//     }, 1000); // Actualizar cada segundo para simular movimiento

//     return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonte
// }, []);

  // Actualizar posición en tiempo real sin renderizar
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = fromLonLat([
            pos.coords.longitude,
            pos.coords.latitude,
          ]);
          markerRef.current.getGeometry().setCoordinates(coords);
          mapInstance.current.getView().setCenter(coords);
        },
        (error) => console.error("Error al obtener ubicación:", error),
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 5000,
        }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      alert("La geolocalización no es compatible con este navegador.");
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper elevation={3} sx={{ width: "100%", height: "70vh", p: 1 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Ruta en ejecución
        </Typography>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      </Paper>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() =>
          mapInstance.current
            .getView()
            .setCenter(markerRef.current.getGeometry().getCoordinates())
        }
      >
        Centrar en mi posición
      </Button>
    </Box>
  );
}
