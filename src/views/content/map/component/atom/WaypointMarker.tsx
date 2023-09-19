import L from "leaflet";
import { onCleanup } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import {
  WaypointType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-line.entity";

import { COLOR_GREEN_BASE } from "../../constant";

const [, { setLineUnderConstruction, getLineUnderConstruction }] =
  useStateAction();

type PolylineDragMarkersProps = {
  map: L.Map;
  latlngs: L.LatLng;
  index: number;
};

const locationDotIcon =
  "<svg fill=" +
  COLOR_GREEN_BASE +
  " stroke='black' stroke-width='1' xmlns='http://www.w3.org/2000/svg' viewBox='100 300 320 512' height='2em' width='2em' style='overflow: visible;'><path d='M16 144a144 144 0 1 1 288 0 144 144 0 1 1-288 0zm144-64c8.8 0 16-7.2 16-16s-7.2-16-16-16c-53 0-96 43-96 96 0 8.8 7.2 16 16 16s16-7.2 16-16c0-35.3 28.7-64 64-64zm-32 400V317.1a177.984 177.984 0 0 0 64 0V480c0 17.7-14.3 32-32 32s-32-14.3-32-32z'></path></svg>";

export default function (props: PolylineDragMarkersProps) {
  const waypointMarkerIcon = L.divIcon({
    className: "dragMarker",
    html: locationDotIcon,
  });

  function onRightClick() {
    const waypoints = [
      ...(getLineUnderConstruction().busLine.waypoints as WaypointType[]),
    ];
    waypoints.splice(props.index, 1);

    setLineUnderConstruction({
      ...getLineUnderConstruction(),
      busLine: {
        ...getLineUnderConstruction().busLine,
        waypoints: waypoints,
      },
    });
    updatePolylineWithOsrm(getLineUnderConstruction().busLine);
  }
  // eslint-disable-next-line solid/reactivity
  const waypointMarker = L.marker(props.latlngs, {
    icon: waypointMarkerIcon,
    pane: "markerPane",
    keyboard: false,
  }).on("contextmenu", onRightClick);

  // eslint-disable-next-line solid/reactivity
  waypointMarker.addTo(props.map);

  onCleanup(() => {
    waypointMarker.remove();
  });
  return <></>;
}
