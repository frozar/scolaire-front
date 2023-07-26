import { LineString } from "geojson";
import L from "leaflet";
import { createEffect, onCleanup } from "solid-js";

interface LineProps {
  latlngs: L.LatLng[];
  leafletMap: L.Map;
  color: string;
  opacity: number;
}

export default function (props: LineProps) {
  let busLinePolyline: L.Polyline;

  createEffect(() => {
    const latlngs = props.latlngs;
    const leafletMap = props.leafletMap;

    const color = props.color;
    const opacity = props.opacity;

    busLinePolyline?.remove();

    busLinePolyline = L.polyline(latlngs, {
      color: color,
      opacity: opacity,
    }) as L.Polyline<LineString>;

    busLinePolyline.addTo(leafletMap);
  });

  onCleanup(() => {
    busLinePolyline?.remove();
  });

  return <></>;
}
