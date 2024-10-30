import React, { useEffect, useRef } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM } from "ol/source";
import { Vector as VectorSource } from "ol/source";
import { fromLonLat, toLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point, LineString } from "ol/geom";
import { Style, Icon, Stroke } from "ol/style";
import { BACKEND_URL } from "../../Utils/Variables";

export default function VisorConductor() {
  const mapRef = useRef();
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const vectorLayerRef = useRef(null); // Ref para la capa del marcador

  const handleEndRoute = () => {
    localStorage.removeItem("ordenTrayectoria")
    window.location.href = "/inicio"
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const initialPosition = fromLonLat([longitude, latitude]);

          // Crear el marcador con el ícono del conductor
          const driverMarker = new Feature({
            geometry: new Point(initialPosition),
          });
          driverMarker.setStyle(
            new Style({
              image: new Icon({
                src: BACKEND_URL + "/media/mapas/vehicle.png",
                scale: 0.11,
              }),
            })
          );

          const vectorSource = new VectorSource({
            features: [driverMarker],
          });
          vectorLayerRef.current = new VectorLayer({
            source: vectorSource,
          });

          // Crear el mapa con OpenLayers sin agregar aún el marcador
          mapInstance.current = new Map({
            target: mapRef.current,
            layers: [
              new TileLayer({
                source: new OSM(),
              })
            ],
            view: new View({
              center: initialPosition,
              zoom: 15,
            }),
          });

          markerRef.current = driverMarker;

          // Llamar a la función para dibujar la línea de la trayectoria
          dibujarLineaTrayectoria();

          // Agregar el marcador como última capa, después de la línea
          mapInstance.current.addLayer(vectorLayerRef.current);
        },
        (error) => console.error("Error al obtener ubicación inicial:", error)
      );
    }
  }, []);

  const dibujarLineaTrayectoria = () => {
    const ordenTrayectoria = JSON.parse(localStorage.getItem("ordenTrayectoria"));
    console.log("Coordenadas de la trayectoria:", ordenTrayectoria);
    if (ordenTrayectoria && mapInstance.current) {
      const coordenadas = ordenTrayectoria.map((punto) =>
        fromLonLat([punto.longitud, punto.latitud])
      );

      const lineaTrayectoria = new Feature({
        geometry: new LineString(coordenadas),
      });

      lineaTrayectoria.setStyle(
        new Style({
          stroke: new Stroke({
            color: "#ff0000",
            width: 4,
          }),
        })
      );

      const lineaSource = new VectorSource({
        features: [lineaTrayectoria],
      });

      const lineaLayer = new VectorLayer({
        source: lineaSource,
      });

      mapInstance.current.addLayer(lineaLayer);
    }
  };

  // Actualizar posición en tiempo real
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = fromLonLat([pos.coords.longitude, pos.coords.latitude]);
          if (markerRef.current) {
            markerRef.current.getGeometry().setCoordinates(coords);
            mapInstance.current.getView().setCenter(coords);
          }
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
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
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
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleEndRoute}
      >
        Finalizar Ruta
      </Button>
    </Box>
  );
}
