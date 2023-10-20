import L from "leaflet";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import {
  currentDrawTrip,
  updateWaypoints,
} from "../../../board/component/organism/DrawTripBoard";
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
  const waypoints = currentDrawTrip().waypoints;
  if (!waypoints) {
    return;
  }

  const newWaypoints = WaypointEntity.createWaypoint(
    waypoints,
    index,
    polylineDragMarker.getLatLng().lat,
    polylineDragMarker.getLatLng().lng
  );

  updateWaypoints(newWaypoints);

  setDraggingWaypointIndex();
}

function handleMouseDown(
  waypointIndex: number,
  map: L.Map,
  polylineDragMarker: L.CircleMarker,
  event: L.LeafletMouseEvent
) {
  if (event.originalEvent.button != 0) return;

  let pointNextIndex = 0;
  for (let i = 0; i < waypointIndex; i++) {
    if (
      currentDrawTrip().waypoints?.at(i)?.idSchool != undefined ||
      currentDrawTrip().waypoints?.at(i)?.idStop != undefined
    ) {
      pointNextIndex += 1;
    }
  }

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
    // case dragMarker is drag&drop over a stop already in the trip
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
    .on("mousedown", (e) => {
      handleMouseDown(props.index, props.map, polylineDragMarker, e);
    })
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
