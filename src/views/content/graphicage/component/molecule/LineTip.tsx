import L from "leaflet";
import { createEffect, createSignal } from "solid-js";
import Line from "../atom/Line";

interface LineTipProps {
  latlng: L.LatLng;
  leafletMap: L.Map;
  color: string;
  opacity: number;
}

export default function (props: LineTipProps) {
  const [lineTip, setLineTip] = createSignal<L.LatLng[]>([]);

  createEffect(() => {
    const leafletMap = props.leafletMap;
    const initlatlng = props.latlng;

    leafletMap?.on("mousemove", ({ latlng }) => {
      setLineTip([
        L.latLng(initlatlng.lat, initlatlng.lng),
        L.latLng(latlng.lat, latlng.lng),
      ]);
    });
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
