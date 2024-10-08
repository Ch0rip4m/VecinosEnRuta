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

export default function Mapa(props) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapCreated, setMapCreated] = useState(false);

  useEffect(() => {
    // Función para crear el mapa
    const createMap = () => {
      // Obtener la ubicación actual del usuario
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const coordinates = [longitude, latitude];
            const newMap = new Map({
              layers: [
                new TileLayer({
                  source: new OSM(),
                }),
              ],
              view: new View({
                center: coordinates,
                zoom: 15,
              }),
            });

            // Crear un marcador en la ubicación actual
            const marker = new Feature({
              geometry: new Point(fromLonLat(coordinates)),
            });
            marker.setStyle(
              new Style({
                image: new Icon({
                  src: "https://openlayers.org/en/latest/examples/data/icon.png",
                }),
              })
            );

            // Capa de marcadores
            const markerLayer = new VectorLayer({
              source: new VectorSource({
                features: [marker],
              }),
            });

            newMap.addLayer(markerLayer);
            newMap.getView().setCenter(fromLonLat(coordinates));
            newMap.setTarget(mapContainerRef.current);
            mapRef.current = newMap;
            setMapCreated(true);
          },
          (error) => {
            console.error("Error al obtener la ubicación:", error.message);
          }
        );
      } else {
        console.error("Geolocalización no soportada por el navegador.");
      }
    };

    // Solo crear el mapa si no ha sido creado aún
    if (!mapCreated) {
      createMap();
    }
  }, [mapCreated]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: props.width, height: props.height }}
    />
  );
}
