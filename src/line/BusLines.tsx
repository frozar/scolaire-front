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
    const polylineRouteTest = polylineRoute();
    if (polylineRouteTest) {
      let busLineDrawn: L.Polyline = new L.Polyline([]);

      const leafletMap = getLeafletMap();
      if (!leafletMap) {
        return;
      }

      const busLine = polylineRouteTest.busLine;
      const polyL = polylineRouteTest.latlngs;
      busLineDrawn = getBusLinePolyline(busLine.color, polyL).addTo(leafletMap);
      // events
      busLinePolylineAttachEvent(
        busLineDrawn,
        busLine.id_bus_line,
        busLine.color,
        isInRemoveLineMode
      );
      busLinesDrawn.push(busLineDrawn);
      // console.log("busLinesDrawn", busLinesDrawn);
    }
  });
  createEffect(() => {
    // Anytime busLines() change the bus lines are redrawn
    busLinesPolyline.map((busLinePolyline) => busLinePolyline.remove());
    busLinesDrawn.map((line) => line.remove());
    // console.log("busLinesPolyline", busLinesPolyline);
    // console.log("busLinesDrawn", busLinesDrawn);

    for (const busLine of busLines()) {
      let busLinePolyline: L.Polyline = new L.Polyline([]);

      const leafletMap = getLeafletMap();
      if (!leafletMap) {
        return;
      }

      // polyline "dessiné"
      if (isInReadMode()) {
        console.log("READ MODE");
        // Récup liste des latlng pour une busLine
        const latlng = getLatLngs(busLine.stops);
        const lnglat = latlng.slice().map((prev) => [prev.lng, prev.lat]);
        // les utiliser dans la requête
        fetchPolyline(lnglat, busLine);
      }

      // polyline vols d'oiseau
      if (isInAddLineMode() || isInRemoveLineMode()) {
        console.log("AddLine MODE or remove line mode");
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

      // console.log("busLinePolyline", busLinePolyline);
    }
    // console.log("busLinesPolyline", busLinesPolyline);
  });

  onCleanup(() => {
    busLinesPolyline.map((busLinePolyline) => busLinePolyline.remove());
    busLinesDrawn.map((line) => line.remove());

    setBusLines([]);
  });

  return <></>;
}
