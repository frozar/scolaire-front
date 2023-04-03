import { onCleanup, createEffect } from "solid-js";
import L from "leaflet";

import { linkMap } from "./global/linkPointIdentityCircle";
import { getLeafletMap } from "./global/leafletMap";
import { Line } from "./type";

export default function LineDisplay(props: any) {
  // Draw line circles/points
  const line: Line = props.line;

  let busLine: L.Polyline;
  const color = "#" + Math.floor(Math.random() * 0xffffff).toString(16);

  createEffect(() => {
    // Take care of undo/redo
    busLine?.remove();

    const latlngs = [];
    for (const pointIdentity of line.stops) {
      const circle = linkMap.get(pointIdentity!);
      if (circle) {
        latlngs.push(circle.getLatLng());
      }
    }

    busLine = L.polyline(latlngs, {
      color: color,
    }).addTo(getLeafletMap());
  });

  onCleanup(() => {
    busLine.remove();
    const leafletMap = getLeafletMap();
    if (!leafletMap) {
      return;
    }
  });

  return <></>;
}
