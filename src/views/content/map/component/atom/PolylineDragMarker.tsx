import L from "leaflet";
import { createEffect, onCleanup } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import {
  BusLineType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-line.entity";
import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import { COLOR_WAYPOINT } from "../../constant";

const [, { getLineUnderConstruction }] = useStateAction();

type PolylineDragMarkersProps = {
  map: L.Map;
  latlngs: L.LatLng;
  index: number;
};
// const dotIcon =
//   "<svg fill='none' stroke-width='2' xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-point-filled' width='1em' height='1em' viewBox='0 0 24 24' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' style='overflow: visible;'><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z' stroke-width='0' fill='black'></path></svg>";

export default function (props: PolylineDragMarkersProps) {
  // const dragMarkerIcon = L.divIcon({
  //   className: "dragMarker",
  //   html: dotIcon,
  // });

  // eslint-disable-next-line solid/reactivity
  // const polylineDragMarker = L.marker(props.latlngs, {
  //   icon: dragMarkerIcon,
  //   pane: "shadowPane",
  //   draggable: true,
  //   keyboard: false,
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
    // ! mettre en place et remove
    function handleMouseUp() {
      console.log("mouseup");

      // ! mouseup à remove après mouseup et mettre en place après mousedown ?
      props.map.off("mousemove");
      props.map.dragging.enable();
      const waypoints = getLineUnderConstruction().busLine.waypoints;
      if (!waypoints) {
        return;
      }

      const newWaypoints = WaypointEntity.createWaypoint(
        waypoints,
        props.index,
        polylineDragMarker.getLatLng().lat,
        polylineDragMarker.getLatLng().lng
      );

      const newBusLine: BusLineType = {
        ...getLineUnderConstruction().busLine,
        waypoints: newWaypoints,
      };
      updatePolylineWithOsrm(newBusLine);
      polylineDragMarker.off("mouseup", handleMouseUp);
    }
    console.log("mousedown");
    polylineDragMarker.on("mouseup", handleMouseUp);
    props.map.dragging.disable();
    createEffect(() => {
      console.log("mousemove");
      props.map.on("mousemove", ({ latlng }) => {
        polylineDragMarker.setLatLng(latlng);
      });
    });
  });
  // .on("mouseup", () => {
  //   console.log("mouseup");

  //   // ! mouseup à remove après mouseup et mettre en place après mousedown ?
  //   props.map.off("mousemove");
  //   props.map.dragging.enable();
  //   const waypoints = getLineUnderConstruction().busLine.waypoints;
  //   if (!waypoints) {
  //     return;
  //   }

  //   const newWaypoints = WaypointEntity.createWaypoint(
  //     waypoints,
  //     props.index,
  //     polylineDragMarker.getLatLng().lat,
  //     polylineDragMarker.getLatLng().lng
  //   );

  //   const newBusLine: BusLineType = {
  //     ...getLineUnderConstruction().busLine,
  //     waypoints: newWaypoints,
  //   };
  //   updatePolylineWithOsrm(newBusLine);
  // });
  // }).on("dragend", () => {
  //   const waypoints = getLineUnderConstruction().busLine.waypoints;
  //   if (!waypoints) {
  //     return;
  //   }

  //   const newWaypoints = WaypointEntity.createWaypoint(
  //     waypoints,
  //     props.index,
  //     polylineDragMarker.getLatLng().lat,
  //     polylineDragMarker.getLatLng().lng
  //   );

  //   const newBusLine: BusLineType = {
  //     ...getLineUnderConstruction().busLine,
  //     waypoints: newWaypoints,
  //   };
  //   updatePolylineWithOsrm(newBusLine);
  // });

  polylineDragMarker.on("mouseover", function () {
    // polylineDragMarker.setOpacity(100);
    polylineDragMarker.setStyle({ fillOpacity: 100 });
  });

  polylineDragMarker.on("mouseout", function () {
    // polylineDragMarker.setOpacity(0);
    polylineDragMarker.setStyle({ fillOpacity: 0 });
  });
  // eslint-disable-next-line solid/reactivity
  polylineDragMarker.addTo(props.map);

  onCleanup(() => {
    polylineDragMarker.remove();
  });
  return <></>;
}
