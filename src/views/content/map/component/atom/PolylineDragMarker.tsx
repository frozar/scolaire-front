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

export default function (props: PolylineDragMarkersProps) {
  // eslint-disable-next-line solid/reactivity
  const polylineDragMarker = L.circleMarker(props.latlngs, {
    fillColor: COLOR_WAYPOINT,
    radius: 6,
    fillOpacity: 0,
    weight: 0,
    pane: "shadowPane",
    className: "dragMarker",
    // eslint-disable-next-line solid/reactivity
  }).on("mousedown", () => {
    function handleMouseUp() {
      props.map.off("mousemove");
      props.map.dragging.enable();
      const waypoints = currentRace().waypoints;
      if (!waypoints) {
        return;
      }

      const newWaypoints = WaypointEntity.createWaypoint(
        waypoints,
        props.index,
        polylineDragMarker.getLatLng().lat,
        polylineDragMarker.getLatLng().lng
      );

      updateWaypoints(newWaypoints);

      setDraggingWaypointIndex();
      polylineDragMarker.off("mouseup", handleMouseUp);
    }
    // ! Get correct nextIndex from waypoints
    let correctIndex = 0;
    for (let i = 0; i < props.index; i++) {
      if (
        currentRace().waypoints?.at(i)?.idSchool != undefined ||
        currentRace().waypoints?.at(i)?.idStop != undefined
      ) {
        correctIndex += 1;
      }
    }
    console.log("currentRace()", currentRace());
    console.log("current wypoint index", correctIndex);

    setDraggingWaypointIndex(correctIndex);
    polylineDragMarker.on("mouseup", handleMouseUp);
    props.map.dragging.disable();
    createEffect(() => {
      props.map.on("mousemove", ({ latlng }) => {
        polylineDragMarker.setLatLng(latlng);
      });
    });
  });

  polylineDragMarker.on("mouseover", function () {
    polylineDragMarker.setStyle({ fillOpacity: 100 });
  });

  polylineDragMarker.on("mouseout", function () {
    polylineDragMarker.setStyle({ fillOpacity: 0 });
  });
  // eslint-disable-next-line solid/reactivity
  polylineDragMarker.addTo(props.map);

  onCleanup(() => {
    polylineDragMarker.remove();
  });
  return <></>;
}
