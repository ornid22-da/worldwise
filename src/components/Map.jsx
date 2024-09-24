/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";
import User from "./User";

function Map() {
  const { cities } = useCities();
  // const [mapPosition, setMapPosition] = useState([40, 0]);
  const { isLoadingPosition, geolocationPosition, getPosition } =
    useGeolocation();
  const [mapLat, mapLng] = useUrlPosition();
  const [mapPosition, setMapPosition] = useState(() => {
    if (geolocationPosition) {
      return [geolocationPosition.lat, geolocationPosition.lng];
    } else if (mapLat && mapLng) {
      return [mapLat, mapLng];
    } else {
      getPosition();
      return [40, 0];
    }
  });

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geolocationPosition) {
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
      }
    },
    [geolocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getPosition}>
        {isLoadingPosition ? "Loading..." : "Use your position"}
      </Button>
      <User />
      <MapContainer
        center={mapPosition}
        zoom={16}
        minZoom={3}
        scrollWheelZoom={true}
        className={styles.map}
        maxBounds={[
          [-90, -180], // Southwest corner (minimum bounds)
          [90, 180], // Northeast corner (maximum bounds)
        ]} // Add maxBounds here
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {geolocationPosition && (
          <Marker position={[geolocationPosition.lat, geolocationPosition.lng]}>
            <Popup>
              <span>📍</span>
              <span>Your Position</span>
            </Popup>
          </Marker>
        )}

        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
