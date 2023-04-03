import { onCleanup, createEffect } from "solid-js";
import L from "leaflet";

import { linkMap } from "./global/linkPointIdentityCircle";
import { getLeafletMap } from "./global/leafletMap";
import { Line } from "./type";

export default function LineDisplay(props: any) {
  // Draw line under construction between circles/points
  const line: Line = props.line;

  let busLine: L.Polyline;
  const color = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
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

  // Draw the tip of the line under construction between
  // the last selected circle and the mouse position

  onCleanup(() => {
    busLine.remove();
    const leafletMap = getLeafletMap();
    if (!leafletMap) {
      return;
    }
  });

  return <></>;
}
