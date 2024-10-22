import React, { useRef, useEffect, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Icon, Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export default function VerComunidades(props) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapCreated, setMapCreated] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState(null);

  // Lista de coordenadas (latitud, longitud) para los marcadores adicionales
  const coordinatesList = props.mapValues

  useEffect(() => {
    // Función para crear el mapa
    const createMap = (userCoordinates) => {
      if (mapRef.current) {
        console.log("El mapa ya está creado.");
        return; // Evitamos crear el mapa nuevamente
      }

      const newMap = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat(userCoordinates), // Centrar en la ubicación del usuario
          zoom: 15,
        }),
      });

      // Crear un marcador en la ubicación actual del usuario
      const userMarker = new Feature({
        geometry: new Point(fromLonLat(userCoordinates)),
      });
      userMarker.setStyle(
        new Style({
          image: new Icon({
            src: "https://iconos8.es/icon/2gsR2g07AQvu/map-pin",
          }),
        })
      );

      // Verificar las coordenadas adicionales
      if (coordinatesList && coordinatesList.length > 0) {

        // Crear marcadores para las coordenadas adicionales
        const additionalMarkers = coordinatesList.map((coordinate, index) => {
          const marker = new Feature({
            geometry: new Point(fromLonLat(coordinate)),
          });
          marker.setStyle(
            new Style({
              image: new Icon({
                src: "https://openlayers.org/en/latest/examples/data/icon.png",
                color: "blue"
              }),
            })
          );
          return marker;
        });

        // Capa de marcadores incluyendo el del usuario y los adicionales
        const markerLayer = new VectorLayer({
          source: new VectorSource({
            features: [userMarker, ...additionalMarkers], // Incluir el marcador del usuario y los adicionales
          }),
        });

        newMap.addLayer(markerLayer);
      } else {
        console.error("No additional coordinates to add markers.");
      }

      newMap.setTarget(mapContainerRef.current);
      mapRef.current = newMap; // Guardamos la referencia del mapa para evitar duplicados
      setMapCreated(true);
    };

    // Obtener la ubicación del usuario
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userCoordinates = [longitude, latitude];
          setUserCoordinates(userCoordinates); // Guardamos las coordenadas del usuario
          createMap(userCoordinates); // Crear el mapa centrado en la ubicación del usuario
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error.message);
        }
      );
    } else {
      console.error("Geolocalización no soportada por el navegador.");
    }

    // Limpiar el mapa cuando el componente se desmonta
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(null); // Limpiar el mapa
        mapRef.current = null; // Reiniciar la referencia
        setMapCreated(false); // Restablecer el estado de creación del mapa
      }
    };
  }, [coordinatesList]); // Dependemos de coordinatesList para asegurarnos de que los puntos están listos

  // Solo renderizar el mapa si tenemos las coordenadas del usuario
  if (!userCoordinates) {
    return null; // No renderizar nada hasta que tengamos las coordenadas
  }

  return (
    <div
      ref={mapContainerRef}
      style={{ width: props.width, height: props.height }}
    />
  );
}
