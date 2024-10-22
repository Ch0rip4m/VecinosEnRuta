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
import { BACKEND_URL } from "../../Utils/Variables";

export default function VerComunidades(props) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null); // Mantener referencia a la capa de marcadores
  const [mapCreated, setMapCreated] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState(null);

  const coordinatesList = props.mapValues;

  useEffect(() => {
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
          center: fromLonLat(userCoordinates),
          zoom: 15,
        }),
      });

      const userMarker = new Feature({
        geometry: new Point(fromLonLat(userCoordinates)),
      });
      userMarker.setStyle(
        new Style({
          image: new Icon({
            src: BACKEND_URL + "/media/mapas/user.svg",
            scale: 0.07,
          }),
        })
      );

      const additionalMarkers = coordinatesList.map((coordinate, index) => {
        const marker = new Feature({
          geometry: new Point(fromLonLat(coordinate)),
        });
        marker.setStyle(
          new Style({
            image: new Icon({
              src: BACKEND_URL + "/media/mapas/community.png",
              scale: 0.2,
            }),
          })
        );
        return marker;
      });

      const markerLayer = new VectorLayer({
        source: new VectorSource({
          features: [userMarker, ...additionalMarkers],
        }),
      });

      newMap.addLayer(markerLayer);
      markerLayerRef.current = markerLayer; // Guardar referencia a la capa de marcadores

      newMap.setTarget(mapContainerRef.current);
      mapRef.current = newMap; // Guardamos la referencia del mapa para evitar duplicados
      setMapCreated(true);
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userCoordinates = [longitude, latitude];
          setUserCoordinates(userCoordinates);
          createMap(userCoordinates);
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error.message);
        }
      );
    } else {
      console.error("Geolocalización no soportada por el navegador.");
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(null);
        mapRef.current = null;
        setMapCreated(false);
      }
    };
  }, [coordinatesList]);

  // Nuevo useEffect para manejar selectCommunity
  useEffect(() => {
    if (props.selectCommunity && props.selectCommunity.length > 0) {
      const [longitude, latitude] = props.selectCommunity;

      // Crear un nuevo marcador en las coordenadas de selectCommunity
      const communityMarker = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
      });
      communityMarker.setStyle(
        new Style({
          image: new Icon({
            src: BACKEND_URL + "/media/mapas/community.png",
            scale: 0.2,
          }),
        })
      );

      // Añadir el marcador a la capa de marcadores existente
      markerLayerRef.current.getSource().addFeature(communityMarker);

      // Centrar el mapa en las nuevas coordenadas
      mapRef.current.getView().setCenter(fromLonLat([longitude, latitude]));
      mapRef.current.getView().setZoom(15); // Ajustar el zoom si es necesario
    }
  }, [props.selectCommunity]);

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
