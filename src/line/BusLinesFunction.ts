import L from "leaflet";

import { createEffect, createSignal } from "solid-js";
import {
  setRemoveConfirmation,
  setBusLineSelected,
  setInfoToDisplay,
} from "../signaux";
import { PointIdentityType, InfoPanelEnum } from "../type";
import { linkMap } from "../global/linkPointIdentityCircle";
import { useStateAction } from "../StateAction";
import { setPickerColor } from "../InformationContent";
import { LineString, MultiLineString } from "geojson";

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

export const [onLine, setOnLine] = createSignal<{
  line: L.Polyline<LineString | MultiLineString>;
  id_bus_line: number;
}>({ line: L.polyline([{ lat: 0, lng: 0 }]), id_bus_line: -1 });

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
    .on("click", (e) => {
      setPickerColor(e.sourceTarget.options.color);

      if (isInRemoveLineMode()) {
        setRemoveConfirmation({
          displayed: true,
          id_bus_line: id_bus_line,
        });
      }
      if (isInReadMode()) {
        setBusLineSelected(id_bus_line);
        setInfoToDisplay(InfoPanelEnum.line);
      }

      setOnLine({ line: self, id_bus_line: id_bus_line });
    });
}
