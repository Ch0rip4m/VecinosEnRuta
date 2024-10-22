import React, { useRef, useEffect, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import { fromLonLat, toLonLat } from "ol/proj";
import { Icon, Style, Stroke } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Draw } from "ol/interaction";
import { BACKEND_URL } from "../../Utils/Variables";

export default function DrawMap(props) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapCreated, setMapCreated] = useState(false);
  const [route, setRoute] = useState([]); // Estado para almacenar la ruta
  const routeLayerRef = useRef(null); // Referencia para la capa de la ruta

  useEffect(() => {
    // Función para crear el mapa
    const createMap = () => {
      // Obtener la ubicación actual del usuario
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const coordinates = fromLonLat([longitude, latitude]); // Transformar a coordenadas de OpenLayers

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
              geometry: new Point(coordinates), // Transformar las coordenadas a sistema EPSG:3857
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
                features: [marker], // Añadir el marcador a la capa de features
              }),
            });

            // Capa vectorial para la ruta
            const routeLayer = new VectorLayer({
              source: new VectorSource(),
              style: new Style({
                stroke: new Stroke({
                  color: "blue",
                  width: 3,
                }),
              }),
            });

            // Guardar referencia a la capa de la ruta
            routeLayerRef.current = routeLayer;

            // Interacción de dibujo
            const draw = new Draw({
              source: routeLayer.getSource(),
              type: "Point",
            });

            // Al hacer click en el mapa, añadir el punto a la ruta
            draw.on("drawend", (event) => {
              const coords = event.feature.getGeometry().getCoordinates();
              const [lon, lat] = toLonLat(coords);

              setRoute((prevRoute) => {
                const updatedRoute = [
                  ...prevRoute,
                  { latitud: lat, longitud: lon },
                ];

                props.onRouteChange(updatedRoute);
                // Actualizar la geometría de la línea
                const lineCoords = updatedRoute.map((point) =>
                  fromLonLat([point.longitud, point.latitud])
                );
                const lineString = new LineString(lineCoords);
                const lineFeature = new Feature({
                  geometry: lineString,
                });

                // Reemplazar la línea anterior con la nueva
                const routeSource = routeLayerRef.current.getSource();
                routeSource.clear(); // Limpiar capa para redibujar
                routeSource.addFeature(lineFeature); // Añadir línea
                return updatedRoute;
              });
            });

            // Añadir capas y setTarget para visualizar el mapa
            newMap.addLayer(markerLayer); // Añadir la capa del marcador
            newMap.addLayer(routeLayer); // Añadir la capa de la ruta
            newMap.addInteraction(draw);
            newMap.setTarget(mapContainerRef.current); // Referencia al contenedor del mapa
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
    <div>
      <div
        ref={mapContainerRef}
        style={{ width: props.width, height: props.height }}
      />
    </div>
  );
}
