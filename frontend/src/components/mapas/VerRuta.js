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

  // Referencias para las capas de puntos y línea
  const pointLayerRef = useRef(null);
  const lineLayerRef = useRef(null);

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

    if (!mapCreated) {
      createMap();
    }
  }, [mapCreated]);

  // Dibujar la trayectoria cuando se actualicen los datos
  useEffect(() => {
    if (mapCreated && props.ordenTrayectoria && props.ordenTrayectoria.length > 0) {
      // Remover la capa de línea y puntos anteriores si existen
      if (lineLayerRef.current) {
        mapRef.current.removeLayer(lineLayerRef.current);
      }
      if (pointLayerRef.current) {
        mapRef.current.removeLayer(pointLayerRef.current);
      }

      const points = props.ordenTrayectoria.map((orden) => {
        return fromLonLat([orden.longitud, orden.latitud]);
      });

      const pointFeatures = points.map((point) => new Feature({ geometry: new Point(point) }));

      const pointSource = new VectorSource({ features: pointFeatures });

      const pointStyle = new Style({
        image: new Icon({
          src: "https://openlayers.org/en/latest/examples/data/icon.png",
          scale: 0.05,
        }),
      });

      // Crear y guardar la capa de puntos en la referencia
      pointLayerRef.current = new VectorLayer({
        source: pointSource,
        style: pointStyle,
      });
      mapRef.current.addLayer(pointLayerRef.current);

      const lineFeature = new Feature({
        geometry: new LineString(points),
      });

      // Crear y guardar la capa de línea en la referencia
      lineLayerRef.current = new VectorLayer({
        source: new VectorSource({
          features: [lineFeature],
        }),
        style: new Style({
          stroke: new Stroke({
            color: "#FF0000",
            width: 4,
          }),
        }),
      });

      mapRef.current.addLayer(lineLayerRef.current);

      mapRef.current.getView().fit(lineFeature.getGeometry().getExtent(), {
        padding: [50, 50, 50, 50],
      });
    }
  }, [props.ordenTrayectoria, mapCreated]);

  return <div ref={mapContainerRef} style={{ width: props.width, height: props.height }} />;
}
