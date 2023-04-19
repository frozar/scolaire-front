import { onCleanup, createEffect } from "solid-js";
import L from "leaflet";
import { useStateAction } from "../StateAction";
import { getLeafletMap } from "../global/leafletMap";
import { COLOR_LINE_UNDER_CONSTRUCTION } from "../constant";

import { getBusLinePolyline, getLatLngs } from "./BusLinesFunction";

const [, { isInRemoveLineMode, getLineUnderConstruction }] = useStateAction();

export default function () {
  const line = () => {
    const pointIdentities = getLineUnderConstruction().stops;
    return {
      id_bus_line: -1,
      color: COLOR_LINE_UNDER_CONSTRUCTION,
      stops: pointIdentities,
    };
  };

  let busLinePolyline: L.Polyline;

  createEffect(() => {
    // Take care of undo/redo
    busLinePolyline?.remove();

    busLinePolyline = getBusLinePolyline(
      line().color,
      getLatLngs(line().stops)
    ).addTo(getLeafletMap());
  });

  onCleanup(() => {
    busLinePolyline?.remove();
  });

  return <></>;
}
