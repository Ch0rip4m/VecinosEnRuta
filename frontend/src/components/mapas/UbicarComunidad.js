import React, { useRef, useEffect, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat, toLonLat } from "ol/proj";
import { Icon, Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Modify } from "ol/interaction";
import { BACKEND_URL } from "../../Utils/Variables";

export default function UbicarComunidad({
  width,
  height,
  onCoordinatesChange,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapCreated, setMapCreated] = useState(false);
  const [coordinates, setCoordinates] = useState(null); // Coordenadas del punto marcado
  const [userLocation, setUserLocation] = useState(null); // Coordenadas de la ubicación del usuario
  const [vectorSource, setVectorSource] = useState(null); // Fuente de los puntos

  // useEffect(() => {
  //     console.log("coordinates: ", coordinates);
  //   }, [coordinates]);

  useEffect(() => {
    const createMap = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const initialCoordinates = [longitude, latitude];

            const source = new VectorSource();
            setVectorSource(source);

            const newMap = new Map({
              layers: [
                new TileLayer({
                  source: new OSM(),
                }),
                new VectorLayer({
                  source: source,
                }),
              ],
              view: new View({
                center: fromLonLat(initialCoordinates),
                zoom: 15,
              }),
            });

            const userMarker = new Feature({
              geometry: new Point(fromLonLat(initialCoordinates)),
            });
            userMarker.setStyle(
              new Style({
                image: new Icon({
                  src: BACKEND_URL + "/media/mapas/user.svg",
                  scale: 0.07,
                }),
              })
            );

            source.addFeature(userMarker);
            setUserLocation({ lat: latitude, lon: longitude });

            newMap.getView().setCenter(fromLonLat(initialCoordinates));
            newMap.setTarget(mapContainerRef.current);
            mapRef.current = newMap;
            setMapCreated(true);

            newMap.on("click", function (event) {
              const clickedCoordinates = toLonLat(event.coordinate);
              const [lon, lat] = clickedCoordinates;

              source.getFeatures().forEach((feature) => {
                if (feature !== userMarker) {
                  source.removeFeature(feature);
                }
              });

              const clickedMarker = new Feature({
                geometry: new Point(event.coordinate),
              });
              clickedMarker.setStyle(
                new Style({
                  image: new Icon({
                    src: BACKEND_URL + "/media/mapas/community.png",
                    scale: 0.2,
                  }),
                })
              );

              source.addFeature(clickedMarker);
              setCoordinates({ lat, lon });

              // Llamar a la función onCoordinatesChange para pasar las coordenadas al padre
              if (onCoordinatesChange) {
                onCoordinatesChange({ lat, lon });
              }
            });

            const modify = new Modify({ source: source });
            newMap.addInteraction(modify);

            modify.on("modifyend", function (event) {
              const updatedCoordinates = source
                .getFeatures()
                .filter((feature) => feature !== userMarker)
                .map((feature) => {
                  const coords = toLonLat(
                    feature.getGeometry().getCoordinates()
                  );
                  return { lat: coords[1], lon: coords[0] };
                })[0];
              setCoordinates(updatedCoordinates);

              if (onCoordinatesChange) {
                onCoordinatesChange(updatedCoordinates);
              }
            });
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

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: width, height: height }} />
    </div>
  );
}
