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

  let busLine: L.Polyline;

  createEffect(() => {
    // Take care of undo/redo
    busLine?.remove();

    busLine = getBusLinePolyline(
      busLine,
      line().id_bus_line,
      line().color,
      getLatLngs(line().stops),
      isInRemoveLineMode
    ).addTo(getLeafletMap());
  });

  onCleanup(() => {
    busLine?.remove();
  });

  return <></>;
}
