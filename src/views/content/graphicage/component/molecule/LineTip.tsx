import L from "leaflet";
import { createEffect, createSignal, onCleanup } from "solid-js";
import Line from "../atom/Line";

interface LineTipProps {
  latlngs: L.LatLng[];
  leafletMap: L.Map;
  opacity: number;
}
interface LineTipLatLngsInterface {
  lineA: L.LatLng[];
  lineB: L.LatLng[];
}

//TODO LineTip: to delete

export default function (props: LineTipProps) {
  const [lineTipLatLngs, setLineTipLatLngs] =
    createSignal<LineTipLatLngsInterface>({ lineA: [], lineB: [] });

  createEffect(() => {
    const leafletMap = props.leafletMap;
    const initlatlng = props.latlngs;

    leafletMap?.on("mousemove", ({ latlng }) => {
      setLineTipLatLngs({
        lineA: [
          L.latLng(initlatlng[0].lat, initlatlng[0].lng),
          L.latLng(latlng.lat, latlng.lng),
        ],
        lineB: [
          L.latLng(initlatlng[1].lat, initlatlng[1].lng),
          L.latLng(latlng.lat, latlng.lng),
        ],
      });
    });
  });

  onCleanup(() => {
    props.leafletMap?.off("mousemove");
    if (props.leafletMap.hasEventListeners("mousemove")) {
      props.leafletMap.off("mousemove");
    }
  });

  return (
    <>
      <Line
        latlngs={lineTipLatLngs().lineA}
        color={"#8fe2ba"}
        opacity={props.opacity}
        leafletMap={props.leafletMap}
      />
      <Line
        latlngs={lineTipLatLngs().lineB}
        color={"#8fe2ba"}
        opacity={props.opacity}
        leafletMap={props.leafletMap}
      />
    </>
  );
}
