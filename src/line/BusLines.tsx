import L from "leaflet";
import { onMount, onCleanup, createEffect } from "solid-js";

import { fetchBusLines, setBusLines, busLines } from "../signaux";
import { pointsReady } from "../PointsRamassageAndEtablissement";
import {
  getBusLinePolyline,
  getLatLngs,
  busLinePolylineAttachEvent,
} from "./BusLinesFunction";
import { getLeafletMap } from "../signaux";

import { useStateAction } from "../StateAction";
const [, { isInRemoveLineMode }] = useStateAction();

export default function () {
  createEffect(() => {
    if (pointsReady()) {
      fetchBusLines();
    }
  });

  let busLinesPolyline: L.Polyline[] = [];

  createEffect(() => {
    // Anytime busLines() change the bus lines are redrawn
    for (const busLinePolyline of busLinesPolyline) {
      busLinePolyline.remove();
    }
    busLinesPolyline = [];

    for (const busLine of busLines()) {
      let busLinePolyline: L.Polyline = new L.Polyline([]);

      const leafletMap = getLeafletMap();
      if (!leafletMap) {
        return;
      }

      busLinePolyline = getBusLinePolyline(
        busLine.color,
        getLatLngs(busLine.stops)
      ).addTo(leafletMap);

      busLinePolylineAttachEvent(
        busLinePolyline,
        busLine.id_bus_line,
        busLine.color,
        isInRemoveLineMode
      );

      busLinesPolyline.push(busLinePolyline);
    }
  });

  onCleanup(() => {
    for (const busLinePolyline of busLinesPolyline) {
      busLinePolyline.remove();
    }
    busLinesPolyline = [];

    setBusLines([]);
  });

  return <></>;
}
