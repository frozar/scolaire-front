import { LineString } from "geojson";
import L from "leaflet";
import { createEffect, onCleanup } from "solid-js";

export default function (props: {
  latlngs: L.LatLng[];
  leafletMap: L.Map;
  color: string;
  opacity: number;
}) {
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
