import { LineString } from "geojson";
import L from "leaflet";
import { createEffect, createSignal, onCleanup } from "solid-js";
import Line from "./Line";

interface LineTipProps {
  latlng: L.LatLng;
  leafletMap: L.Map;
  color: string;
  opacity: number;
}

export default function (props: LineTipProps) {
  let lineUnderConstructionTip: L.Polyline;
  let busLinePolyline: L.Polyline;

  const [lineTip, setLineTip] = createSignal<L.LatLng[]>([]);

  createEffect(() => {
    const leafletMap = props.leafletMap;
    const initlatlng = props.latlng;
    const color = props.color;
    const opacity = props.opacity;

    busLinePolyline?.remove();

    busLinePolyline = L.polyline([initlatlng], {
      color: color,
      opacity: opacity,
    }) as L.Polyline<LineString>;

    busLinePolyline.addTo(leafletMap);

    leafletMap?.on("mousemove", ({ latlng }) => {
      setLineTip([
        new L.LatLng(initlatlng.lat, initlatlng.lng),
        new L.LatLng(latlng.lat, latlng.lng),
      ]);
    });
  });

  onCleanup(() => {
    lineUnderConstructionTip?.remove();
    busLinePolyline?.remove();
  });

  return (
    <Line
      latlngs={lineTip()}
      color={props.color}
      opacity={props.opacity}
      leafletMap={props.leafletMap}
    />
  );
}
