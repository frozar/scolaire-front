import L from "leaflet";
import { onCleanup, createEffect } from "solid-js";

import {
  fetchBusLines,
  setBusLines,
  busLines,
  fetchPolyline,
  polylineRoute,
} from "../signaux";
import { pointsReady } from "../PointsRamassageAndEtablissement";
import {
  getBusLinePolyline,
  getLatLngs,
  busLinePolylineAttachEvent,
} from "./BusLinesFunction";
import { getLeafletMap } from "../signaux";

import { useStateAction } from "../StateAction";
const [, { isInRemoveLineMode, isInAddLineMode, isInReadMode }] =
  useStateAction();

export default function () {
  createEffect(() => {
    if (pointsReady()) {
      fetchBusLines();
    }
  });

  const busLinesPolyline: L.Polyline[] = [];
  const busLinesDrawn: L.Polyline[] = [];

  createEffect(() => {
    const drawnPolylineRoute = polylineRoute();
    if (drawnPolylineRoute.busLine.id_bus_line != -1) {
      let busLineDrawn: L.Polyline = new L.Polyline([]);

      const leafletMap = getLeafletMap();
      if (!leafletMap) {
        return;
      }

      const busLine = drawnPolylineRoute.busLine;
      const polyline = drawnPolylineRoute.latlngs;
      busLineDrawn = getBusLinePolyline(busLine.color, polyline).addTo(
        leafletMap
      );
      busLinePolylineAttachEvent(
        busLineDrawn,
        busLine.id_bus_line,
        busLine.color,
        isInRemoveLineMode
      );
      busLinesDrawn.push(busLineDrawn);
    }
  });
  createEffect(() => {
    // Anytime busLines() change the bus lines are redrawn
    busLinesPolyline.map((busLinePolyline) => busLinePolyline.remove());
    busLinesDrawn.map((line) => line.remove());

    for (const busLine of busLines()) {
      // drawn routes
      if (isInReadMode()) {
        const latlng = getLatLngs(busLine.stops);
        const lnglat = latlng.slice().map((prev) => [prev.lng, prev.lat]);
        fetchPolyline(lnglat, busLine);
      }

      // straight routes
      if (isInAddLineMode() || isInRemoveLineMode()) {
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
    }
  });

  onCleanup(() => {
    busLinesPolyline.map((busLinePolyline) => busLinePolyline.remove());
    busLinesDrawn.map((line) => line.remove());

    setBusLines([]);
  });

  return <></>;
}
