import L from "leaflet";
import { onMount, onCleanup, createEffect } from "solid-js";

import { fetchBusLines, setBusLines, busLines } from "../signaux";
import { pointsReady } from "../PointsRamassageAndEtablissement";
import { getBusLinePolyline, getLatLngs } from "./BusLinesFunction";
import { getLeafletMap } from "../global/leafletMap";

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
      busLinePolyline?.remove();
    }
    busLinesPolyline = [];

    for (const busLine of busLines()) {
      let busLinePolyline: L.Polyline = new L.Polyline([]);

      busLinePolyline = getBusLinePolyline(
        busLinePolyline,
        busLine.id_bus_line,
        busLine.color,
        getLatLngs(busLine.stops),
        isInRemoveLineMode
      ).addTo(getLeafletMap());
    }
  });

  onCleanup(() => {
    setBusLines([]);
  });

  return <></>;
}
