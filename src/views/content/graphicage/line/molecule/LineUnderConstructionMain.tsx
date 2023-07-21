import L from "leaflet";
import { createEffect, onCleanup } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { getLeafletMap } from "../../../../../signaux";
import { COLOR_LINE_UNDER_CONSTRUCTION } from "../../constant";

import { getBusLinePolyline, getLatLngs } from "../busLinesUtils";

const [, { getLineUnderConstruction }] = useStateAction();

export default function () {
  const line = () => {
    return {
      idBusLine: -1,
      color: COLOR_LINE_UNDER_CONSTRUCTION,
      stops: getLineUnderConstruction().stops,
    };
  };

  let busLinePolyline: L.Polyline;

  createEffect(() => {
    // Take care of undo/redo
    busLinePolyline?.remove();

    const leafletMap = getLeafletMap();
    if (!leafletMap) {
      return;
    }

    busLinePolyline = getBusLinePolyline(
      line().color,
      getLatLngs(line().stops),
      1
    ).addTo(leafletMap);
  });

  onCleanup(() => {
    busLinePolyline?.remove();
  });

  return <></>;
}
