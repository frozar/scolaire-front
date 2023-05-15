import L from "leaflet";

import { createEffect } from "solid-js";
import {
  setRemoveConfirmation,
  setBusLineSelected,
  setInfoToDisplay,
  busLineSelected,
} from "../signaux";
import { PointIdentityType, LastSelectionEnum } from "../type";
import { linkMap } from "../global/linkPointIdentityCircle";
import { useStateAction } from "../StateAction";

const [, { isInReadMode }] = useStateAction();
export function getLatLngs(stops: PointIdentityType[]): L.LatLng[] {
  const latlngs: L.LatLng[] = [];
  for (const pointIdentity of stops) {
    const circle = linkMap.get(pointIdentity.id_point);
    if (circle) {
      latlngs.push(circle.getLatLng());
    }
  }
  return latlngs;
}

export function getBusLinePolyline(color: string, latlngs: L.LatLng[]) {
  return L.polyline(latlngs, {
    color: color,
  });
}

export function busLinePolylineAttachEvent(
  self: L.Polyline,
  id_bus_line: number,
  color: string,
  isInRemoveLineMode: () => boolean
): void {
  self
    .on("mouseover", () => {
      createEffect(() => {
        if (!isInRemoveLineMode()) {
          self.setStyle({ color: color, weight: 3 });
        }
      });
      if (isInRemoveLineMode()) {
        self.setStyle({ color: "#FFF", weight: 8 });
      }
    })
    .on("mouseout", () => {
      if (isInRemoveLineMode()) {
        self.setStyle({ color: color, weight: 3 });
      }
    })
    .on("click", () => {
      if (isInRemoveLineMode()) {
        setRemoveConfirmation({
          displayed: true,
          id_bus_line: id_bus_line,
        });
      }
      if (isInReadMode()) {
        console.log("ligne séléctionné");
        setBusLineSelected(id_bus_line);
        console.log("ligne enregistré dans signal=>", id_bus_line);
        console.log("busLineSelected()", busLineSelected());
        setInfoToDisplay(LastSelectionEnum.line);
      }
    });
}
