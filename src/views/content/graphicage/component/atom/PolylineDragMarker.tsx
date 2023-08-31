import L from "leaflet";
import { createEffect, onCleanup } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import {
  WaypointType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-line.entity";

const [, { setLineUnderConstruction, getLineUnderConstruction }] =
  useStateAction();

type PolylineDragMarkersProps = {
  map: L.Map;
  latlngs: L.LatLng;
  // ! Rename !?
  indexPointBefore: number;
};
const dotIcon =
  "<svg fill='none' stroke-width='2' xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-point-filled' width='1em' height='1em' viewBox='0 0 24 24' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' style='overflow: visible;'><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z' stroke-width='0' fill='black'></path></svg>";

export default function (props: PolylineDragMarkersProps) {
  //   const marker = L.marker()
  const dragMarkerIcon = L.divIcon({
    className: "dragMarker",
    html: dotIcon,
  });

  // const polylineDragMarker = L.marker(props.latlngs, {
  //   icon: dragMarkerIcon,
  //   pane: "overlayPane",
  //   keyboard: false,
  // }).addTo(props.map);
  function onMouseDown() {
    props.map.dragging.disable();
    createEffect(() => {
      props.map?.on("mousemove", ({ latlng }) => {
        polylineDragMarker.setLatLng(latlng);
      });
    });
    // ! Déplacer hors de là ?
    function handleMouseUp() {
      // ! refactor ? (BusLine.tsx)
      props.map?.off("mousemove");
      if (props.map.hasEventListeners("mousemove")) {
        props.map.off("mousemove");
      }

      props.map.dragging.enable();

      // ! ici ajouter le nouveau waypoints !
      const newWaypoint: WaypointType = {
        lat: polylineDragMarker.getLatLng().lat,
        lon: polylineDragMarker.getLatLng().lng,
      };

      let waypoints = getLineUnderConstruction().busLine
        .waypoints as WaypointType[];
      waypoints = [...waypoints];
      console.log("oldWaypoint =>", waypoints);
      waypoints.splice(props.indexPointBefore, 0, newWaypoint);
      console.log("new Waypoint =>", waypoints);
      // setLineUnderConstruction((prev: LineUnderConstructionType) => {
      // prev.busLine.waypoints?.splice(props.indexPointBefore, 0, newWaypoint);
      // return { ...prev };
      // });
      // setLineUnderConstruction((prev) => {
      // const updatedPrev = { ...prev };
      // prev.busLine.waypoints?.splice(props.indexPointBefore, 0, newWaypoint);
      // return { ...prev };
      // });
      setLineUnderConstruction({
        ...getLineUnderConstruction(),
        busLine: {
          ...getLineUnderConstruction().busLine,
          waypoints: waypoints,
        },
      });

      // ! ensuite refaire l'update osrm

      updatePolylineWithOsrm(getLineUnderConstruction().busLine); // ! await ?

      document.removeEventListener("mouseup", handleMouseUp);
    }
    document.addEventListener("mouseup", handleMouseUp);
  }

  const polylineDragMarker = L.marker(props.latlngs, {
    icon: dragMarkerIcon,
    pane: "overlayPane",
    keyboard: false,
  }).on("mousedown", onMouseDown);

  polylineDragMarker.addTo(props.map);

  onCleanup(() => {
    polylineDragMarker.remove();
  });
  return <></>;
}
