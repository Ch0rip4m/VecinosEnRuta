// MapaUbicacion.js
import React, { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Style, Icon } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import axios from "axios";
import { Paper, Typography, Box, Button } from "@mui/material";
import { BACKEND_URL } from "../../Utils/Variables";

export default function MapaUbicacion() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [vectorSource, setVectorSource] = useState(null); // Nueva variable para la fuente de vectores
  const [coordenadas, setCoordenadas] = useState({
    latitud: null,
    longitud: null,
  });

  const fetchCoordenadas = async () => {
    try {
      const response = await axios.get(
        BACKEND_URL + "/db-manager/obtener-ubicacion/",
        {
          params: { id_receptor: localStorage.getItem("user_id") },
          withCredentials: true,
        }
      );
      const { latitud, longitud } = response.data;
      setCoordenadas({ latitud, longitud });
      console.log("Coordenadas recibidas:", response.data);
    } catch (error) {
      console.error("Error al obtener coordenadas:", error);
    }
  };

  useEffect(() => {
    fetchCoordenadas();
    const intervalId = setInterval(fetchCoordenadas, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (coordenadas.latitud === null || coordenadas.longitud === null) return;

    // Inicializar el mapa solo una vez
    if (!map) {
      const newVectorSource = new VectorSource(); // Crear la fuente de vectores
      const vectorLayer = new VectorLayer({ source: newVectorSource });

      const newMap = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([coordenadas.longitud, coordenadas.latitud]),
          zoom: 15,
        }),
      });

      // Crear el marcador de ubicación
      const newMarker = new Feature({
        geometry: new Point(
          fromLonLat([coordenadas.longitud, coordenadas.latitud])
        ),
      });

      newMarker.setStyle(
        new Style({
          image: new Icon({
            src: BACKEND_URL + "/media/mapas/vehicle.png",
            scale: 0.08,
          }),
        })
      );

      newVectorSource.addFeature(newMarker); // Agregar el marcador a la nueva fuente
      setMap(newMap);
      setMarker(newMarker);
      setVectorSource(newVectorSource); // Guardar la referencia de la fuente de vectores
    } else {
      // Actualizar el marcador existente
      if (marker && vectorSource) {
        // Actualizar las coordenadas del marcador
        marker
          .getGeometry()
          .setCoordinates(
            fromLonLat([coordenadas.longitud, coordenadas.latitud])
          );

        // Verifica si el marcador está en la fuente de vectores
        if (!vectorSource.getFeatures().includes(marker)) {
          vectorSource.addFeature(marker); // Asegúrate de que el marcador esté en la fuente
        }

        // Centrar el mapa en la nueva ubicación
        map
          .getView()
          .setCenter(fromLonLat([coordenadas.longitud, coordenadas.latitud]));
      }
    }
  }, [coordenadas, map, marker, vectorSource]);

  const handleStopShareLocation = () => {
    window.location.href = "/seguridad";
  };

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
          Ubicación en Tiempo Real
        </Typography>
        <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
        {(!coordenadas.latitud || !coordenadas.longitud) && (
          <Typography color="error" variant="body2" align="center" mt={2}>
            Coordenadas no disponibles.
          </Typography>
        )}
      </Paper>
      <Button
        color="primary"
        variant="contained"
        sx={{ mt: 2 ,bgcolor: "var(--navbar-color)"}}
        onClick={handleStopShareLocation}
      >
        Dejar de ver ubicación
      </Button>
    </Box>
  );
}
