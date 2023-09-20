import L from "leaflet";
import { onCleanup } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import {
  WaypointType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-line.entity";

import { COLOR_WAYPOINT } from "../../constant";

const [, { setLineUnderConstruction, getLineUnderConstruction }] =
  useStateAction();

type PolylineDragMarkersProps = {
  map: L.Map;
  latlngs: L.LatLng;
  index: number;
};

export default function (props: PolylineDragMarkersProps) {
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
  const waypointMarker = L.circleMarker(props.latlngs, {
    weight: 0,
    radius: 6,
    fillColor: COLOR_WAYPOINT,
    fillOpacity: 1,
    pane: "markerPane",
  }).on("contextmenu", onRightClick);

  // eslint-disable-next-line solid/reactivity
  waypointMarker.addTo(props.map);

  onCleanup(() => {
    waypointMarker.remove();
  });
  return <></>;
}
