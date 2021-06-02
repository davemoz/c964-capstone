import { useRef, useEffect, Fragment } from "react";
import { icon } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Circle,
  Tooltip,
} from "react-leaflet";
import { GEOAPIFY_API_URL, GEOAPIFY_API_KEY } from "../utils/constants";
import { useBoroughs } from "../utils/hooks";
import { boroughColorsByCode } from "../utils/boroughs";
import styles from "../styles/Map.module.css";
import "../node_modules/leaflet/dist/leaflet.css";
import { area } from "d3-shape";

const mapArgs = {
  lat: 40.73061,
  lon: -73.935242,
  zoom: 10,
  markerWidth: 12,
  markerHeight: 12,
};

const ICON = icon({
  iconUrl: "/marker.svg",
  iconSize: [32, 32],
});

const Map = () => {
  const { data, isLoading, isError } = useBoroughs();
  return (
    <MapContainer
      id={styles.mapid}
      center={[mapArgs.lat, mapArgs.lon]}
      zoom={mapArgs.zoom}
      scrollWheelZoom={false}
    >
      <TileLayer
        url={
          `${GEOAPIFY_API_URL}` +
          `center=${mapArgs.lat},${mapArgs.lon}` +
          `&zoom=${mapArgs.zoom}` +
          `&size=1920x400` +
          `&apiKey=${GEOAPIFY_API_KEY}`
        }
      />
      {data?.map((borough, idx) => {
        const reversedBoroCoords = borough.the_geom.coordinates.map((area) =>
          area[0].map((coords) => coords.reverse())
        );
        return (
          <Polygon
            key={borough.boro_name + `-${idx}`}
            color={boroughColorsByCode.get(+borough.boro_code)}
            positions={reversedBoroCoords}
            stroke={false}
            fillOpacity={0.3}
          >
            <Tooltip sticky>{borough.boro_name}</Tooltip>
          </Polygon>
        );
      })}
    </MapContainer>
  );
};

export default Map;
