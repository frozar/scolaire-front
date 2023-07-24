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
const a = L.latLng(-20.9466588303741, 55.5343806753509);
let test: L.Map;
const [lineTip, setLineTip] = createSignal<L.LatLng[]>([
  new L.LatLng(a.lat, a.lng),
  new L.LatLng(a.lat, a.lng + 1),
]);

export default function (props: LineTipProps) {
  let lineUnderConstructionTip: L.Polyline;
  let busLinePolyline: L.Polyline;

  createEffect(() => {
    const leafletMap = props.leafletMap;
    const initlatlng = props.latlng;
    // const leafletMap = props.leafletMap;
    if (!test) {
      test = leafletMap;
    } else {
      console.log("test");
      console.log(test === leafletMap);
      console.log("leafletMap");
      console.log(leafletMap);
    }
    const color = props.color;
    const opacity = props.opacity;
    busLinePolyline?.remove();
    busLinePolyline = L.polyline([initlatlng], {
      color: color,
      opacity: opacity,
    }) as L.Polyline<LineString>;

    // console.log(lineTip());
    busLinePolyline.addTo(leafletMap);
    leafletMap?.on("mousemove", ({ latlng }) => {
      console.log("mousemove");

      setLineTip([
        new L.LatLng(initlatlng.lat, initlatlng.lng),
        new L.LatLng(latlng.lat, latlng.lng),
      ]);

      //drawLineTip(initlatlng, latlng, leafletMap, color);
    });
  });

  function drawLineTip(
    initlatlng: L.LatLng,
    latlng: L.LatLng,
    leafletMap: L.Map,
    color: string
  ) {
    const latlngs = [initlatlng, latlng];

    // If the tip doesn't exist, create it and add it to the map,...
    if (!lineUnderConstructionTip) {
      lineUnderConstructionTip = L.polyline(latlngs, {
        color: color,
        pane: "markerPane",
      });
      lineUnderConstructionTip.addTo(leafletMap);
    }
    // ... else update it
    else {
      lineUnderConstructionTip.setLatLngs(latlngs);
    }

    // The line tip must not catch mouse event like click, hover, etc...
    const element = lineUnderConstructionTip?.getElement() as SVGElement;
    if (element && String(element.style) !== "pointer-events: none;") {
      // @ts-expect-error: 'style' field should not be assigned
      element.style = "pointer-events: none;";
    }
  }

  onCleanup(() => {
    lineUnderConstructionTip?.remove();
    busLinePolyline?.remove();
  });
  //return <></>;
  return (
    <Line
      latlngs={lineTip()}
      color={props.color}
      opacity={1}
      leafletMap={props.leafletMap}
    />
  );
}
