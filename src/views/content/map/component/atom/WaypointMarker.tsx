import L from "leaflet";
import { onCleanup } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import {
  BusCourseType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-course.entity";

import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import { COLOR_WAYPOINT } from "../../constant";

const [, { getCourseUnderConstruction }] = useStateAction();

type PolylineDragMarkersProps = {
  map: L.Map;
  latlngs: L.LatLng;
  index: number;
};

export default function (props: PolylineDragMarkersProps) {
  function onRightClick() {
    const waypoints = getCourseUnderConstruction().busCourse.waypoints;
    if (!waypoints) {
      return;
    }
    const newWaypoints = WaypointEntity.deleteWaypoint(waypoints, props.index);

    const newBusCourse: BusCourseType = {
      ...getCourseUnderConstruction().busCourse,
      waypoints: newWaypoints,
    };
    updatePolylineWithOsrm(newBusCourse);
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
