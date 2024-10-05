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
import { Icon, Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Draw from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify"; // Para editar geometrías
import Axios from "axios";

export default function DrawMap(props) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapCreated, setMapCreated] = useState(false);
  const [routePoints, setRoutePoints] = useState([]);
  const [drawInteraction, setDrawInteraction] = useState(null);
  const [modifyInteraction, setModifyInteraction] = useState(null);

  useEffect(() => {
    // Función para crear el mapa
    const createMap = () => {
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

            // Capa para las rutas dibujadas
            const routeLayer = new VectorLayer({
              source: new VectorSource(),
            });

            // Añadir capas al mapa
            newMap.addLayer(markerLayer);
            newMap.addLayer(routeLayer);

            // Añadir interacción para dibujar rutas (líneas)
            const draw = new Draw({
              source: routeLayer.getSource(),
              type: "LineString",
            });

            // Guardar la interacción de dibujo en el estado
            setDrawInteraction(draw);

            // Añadir interacción para modificar rutas (mover/borrar puntos)
            const modify = new Modify({ source: routeLayer.getSource() });

            // Guardar la interacción de modificación en el estado
            setModifyInteraction(modify);

            // Manejar el evento cuando se complete el dibujo de una ruta
            draw.on("drawend", (event) => {
              const feature = event.feature;
              const geometry = feature.getGeometry();
              const coordinates = geometry.getCoordinates();

              // Crear una nueva ruta con puntos { latitud, longitud, orden }
              const newRoutePoints = coordinates.map((coord, index) => {
                const [lon, lat] = toLonLat(coord);
                return {
                  latitud: lat,
                  longitud: lon,
                  orden: index + 1,
                };
              });

              // Actualizar el estado con los puntos de la ruta
              setRoutePoints(newRoutePoints);

              // Enviar la ruta al backend
            //   Axios.post("/api/ruta", newRoutePoints)
            //     .then((response) => {
            //       console.log("Ruta guardada:", response.data);
            //     })
            //     .catch((error) => {
            //       console.error("Error al enviar la ruta:", error);
            //     });
            });

            // Manejar el evento cuando se modifique la ruta (puntos movidos/eliminados)
            modify.on("modifyend", (event) => {
              const modifiedFeatures = event.features.getArray();
              if (modifiedFeatures.length > 0) {
                const geometry = modifiedFeatures[0].getGeometry();
                const coordinates = geometry.getCoordinates();

                // Crear una nueva ruta con puntos { latitud, longitud, orden }
                const updatedRoutePoints = coordinates.map((coord, index) => {
                  const [lon, lat] = toLonLat(coord);
                  return {
                    latitud: lat,
                    longitud: lon,
                    orden: index + 1,
                  };
                });

                // Actualizar el estado con los puntos modificados
                setRoutePoints(updatedRoutePoints);

                // Opción: Actualizar la ruta en el backend tras la modificación
            //     Axios.put("/api/ruta", updatedRoutePoints)
            //       .then((response) => {
            //         console.log("Ruta actualizada:", response.data);
            //       })
            //       .catch((error) => {
            //         console.error("Error al actualizar la ruta:", error);
            //       });
                }
            });

            // Añadir las interacciones al mapa
            newMap.addInteraction(draw);
            newMap.addInteraction(modify);

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

    if (!mapCreated) {
      createMap();
    }
  }, [mapCreated]);

  // Función para activar o desactivar el modo de dibujo o modificación
  const toggleInteraction = (interaction) => {
    if (mapRef.current) {
      if (interaction === "draw") {
        mapRef.current.removeInteraction(modifyInteraction);
        mapRef.current.addInteraction(drawInteraction);
      } else if (interaction === "modify") {
        mapRef.current.removeInteraction(drawInteraction);
        mapRef.current.addInteraction(modifyInteraction);
      }
    }
  };

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{ width: props.width, height: props.height }}
      />
      <button onClick={() => toggleInteraction("draw")}>
        Dibujar nueva ruta
      </button>
      <button onClick={() => toggleInteraction("modify")}>
        Modificar ruta
      </button>
    </div>
  );
}
