import L from "leaflet";

import { createEffect } from "solid-js";
import { setRemoveConfirmation } from "../signaux";
import { PointIdentity } from "../type";
import { linkMap } from "../global/linkPointIdentityCircle";

export function getLatLngs(stops: PointIdentity[]): L.LatLng[] {
  const latlngs: L.LatLng[] = [];
  for (const pointIdentity of stops) {
    const circle = linkMap.get(pointIdentity.id_point);
    if (circle) {
      latlngs.push(circle.getLatLng());
    }
  }
  return latlngs;
}

export function getBusLinePolyline(
  busLine: L.Polyline,
  id_bus_line: number,
  color: string,
  latlngs: L.LatLng[],
  isInRemoveLineMode: () => boolean
) {
  return (
    L.polyline(latlngs, {
      color: color,
    })
      // .addTo(getLeafletMap())
      .on("mouseover", () => {
        createEffect(() => {
          if (!isInRemoveLineMode()) {
            busLine.setStyle({ color: color, weight: 3 });
          }
        });
        if (isInRemoveLineMode()) {
          busLine.setStyle({ color: "#FFF", weight: 8 });
        }
      })
      .on("mouseout", () => {
        if (isInRemoveLineMode()) {
          busLine.setStyle({ color: color, weight: 3 });
        }
      })
      .on("click", () => {
        if (isInRemoveLineMode()) {
          setRemoveConfirmation({
            displayed: true,
            id_bus_line: id_bus_line,
          });
        }
      })
  );
}
