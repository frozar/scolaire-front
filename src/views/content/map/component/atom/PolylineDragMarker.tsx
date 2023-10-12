import L from "leaflet";
import { createEffect, onCleanup } from "solid-js";
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

      polylineDragMarker.off("mouseup", handleMouseUp);
    }
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
