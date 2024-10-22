import React, { useRef, useEffect, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import { fromLonLat } from "ol/proj";
import { Icon, Style, Stroke } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { BACKEND_URL } from "../../Utils/Variables";

export default function VerRuta(props) {
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
                center: fromLonLat(coordinates),
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
                  src: BACKEND_URL + "/media/mapas/user.svg",
                  scale: 0.07,
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

  // Dibujar la trayectoria cuando se actualicen los datos
  useEffect(() => {
    if (
      mapCreated &&
      props.ordenTrayectoria &&
      props.ordenTrayectoria.length > 0
    ) {
      // console.log(props.ordenTrayectoria)
      // Extraer los puntos de la trayectoria desde props.ordenTrayectorias
      const points = props.ordenTrayectoria.map((orden) => {
        return fromLonLat([orden.longitud, orden.latitud]); // Asegúrate de que orden tenga longitud y latitud
      });

      // Crear las features de puntos
      const pointFeatures = points.map((point) => {
        return new Feature({
          geometry: new Point(point),
        });
      });

      // Crear un vector source para los puntos
      const pointSource = new VectorSource({
        features: pointFeatures,
      });

      // Crear un estilo para los puntos
      const pointStyle = new Style({
        image: new Icon({
          src: "https://openlayers.org/en/latest/examples/data/icon.png",
          scale: 0.05,
        }),
      });

      // Crear la capa para los puntos
      const pointLayer = new VectorLayer({
        source: pointSource,
        style: pointStyle,
      });

      // Añadir la capa de puntos al mapa
      mapRef.current.addLayer(pointLayer);

      // Crear una LineString para conectar los puntos
      const lineFeature = new Feature({
        geometry: new LineString(points),
      });

      // Crear una capa para la línea
      const lineLayer = new VectorLayer({
        source: new VectorSource({
          features: [lineFeature],
        }),
        style: new Style({
          stroke: new Stroke({
            color: "#FF0000", // Color rojo para la línea
            width: 4,
          }),
        }),
      });

      // Añadir la capa de línea al mapa
      mapRef.current.addLayer(lineLayer);

      // Centrar el mapa en los puntos si es necesario
      mapRef.current.getView().fit(lineFeature.getGeometry().getExtent(), {
        padding: [50, 50, 50, 50], // Agrega un padding para ver mejor la ruta
      });
    }
  }, [props.ordenTrayectoria, mapCreated]); // Solo se ejecuta cuando ordenTrayectorias cambia o el mapa está listo

  return (
    <div
      ref={mapContainerRef}
      style={{ width: props.width, height: props.height }}
    />
  );
}
