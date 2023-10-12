import L from "leaflet";
import { onCleanup } from "solid-js";

import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import {
  currentRace,
  updateWaypoints,
} from "../../../board/component/organism/DrawRaceBoard";
import { COLOR_WAYPOINT } from "../../constant";

type PolylineDragMarkersProps = {
  map: L.Map;
  latlngs: L.LatLng;
  index: number;
};

export default function (props: PolylineDragMarkersProps) {
  function onRightClick() {
    const waypoints = currentRace().waypoints;
    if (!waypoints) {
      return;
    }
    const newWaypoints = WaypointEntity.deleteWaypoint(waypoints, props.index);
    updateWaypoints(newWaypoints);
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
