import L from "leaflet";
import { createEffect, createSignal, onCleanup } from "solid-js";
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

export const [draggingWaypointIndex, setDraggingWaypointIndex] =
  createSignal<number>();

function handleMouseUp(
  map: L.Map,
  index: number,
  polylineDragMarker: L.CircleMarker
) {
  map.off("mousemove");
  map.dragging.enable();
  const waypoints = currentRace().waypoints;
  if (!waypoints) {
    return;
  }

  const newWaypoints = WaypointEntity.createWaypoint(
    waypoints,
    index,
    polylineDragMarker.getLatLng().lat,
    polylineDragMarker.getLatLng().lng
  );
  console.log("new waypoints => ", newWaypoints);

  updateWaypoints(newWaypoints);

  setDraggingWaypointIndex();
}

function handleMouseDown(
  waypointIndex: number,
  map: L.Map,
  polylineDragMarker: L.CircleMarker
) {
  let pointNextIndex = 0;
  for (let i = 0; i < waypointIndex; i++) {
    if (
      currentRace().waypoints?.at(i)?.idSchool != undefined ||
      currentRace().waypoints?.at(i)?.idStop != undefined
    ) {
      pointNextIndex += 1;
    }
  }
  // console.log("currentRace()", currentRace());
  console.log("current wypoint index", pointNextIndex);

  setDraggingWaypointIndex(pointNextIndex);
  polylineDragMarker.on("mouseup", () =>
    handleMouseUp(map, waypointIndex, polylineDragMarker)
  );
  map.dragging.disable();
  createEffect(() => {
    map.on("mousemove", ({ latlng }) => {
      polylineDragMarker.setLatLng(latlng);
    });
  });
}

export default function (props: PolylineDragMarkersProps) {
  createEffect(() => {
    if (
      !draggingWaypointIndex() &&
      polylineDragMarker.hasEventListeners("mouseup")
    ) {
      polylineDragMarker.off("mouseup");
      polylineDragMarker.setLatLng(props.latlngs);
    }
  });
  // eslint-disable-next-line solid/reactivity
  const polylineDragMarker = L.circleMarker(props.latlngs, {
    fillColor: COLOR_WAYPOINT,
    radius: 6,
    fillOpacity: 0,
    weight: 0,
    pane: "shadowPane",
    className: "dragMarker",
  });

  polylineDragMarker
    // eslint-disable-next-line solid/reactivity
    .on("mousedown", () =>
      handleMouseDown(props.index, props.map, polylineDragMarker)
    )
    .on("mouseover", () => {
      polylineDragMarker.setStyle({ fillOpacity: 100 });
    })
    .on("mouseout", () => {
      polylineDragMarker.setStyle({ fillOpacity: 0 });
    });

  // eslint-disable-next-line solid/reactivity
  polylineDragMarker.addTo(props.map);

  onCleanup(() => {
    polylineDragMarker.remove();
  });
  return <></>;
}
