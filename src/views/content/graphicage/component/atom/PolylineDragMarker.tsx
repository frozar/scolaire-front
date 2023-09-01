import L from "leaflet";
import { onCleanup } from "solid-js";
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
  const dragMarkerIcon = L.divIcon({
    className: "dragMarker",
    html: dotIcon,
  });

  // function onMouseDown() {
  //   props.map.dragging.disable();
  //   createEffect(() => {
  //     props.map?.on("mousemove", ({ latlng }) => {
  //       polylineDragMarker.setLatLng(latlng);
  //     });
  //   });
  //   // ! Déplacer hors de là ?
  //   function handleMouseUp() {
  //     props.map?.off("mousemove");
  //     if (props.map.hasEventListeners("mousemove")) {
  //       props.map.off("mousemove");
  //     }

  //     props.map.dragging.enable();

  //     const newWaypoint: WaypointType = {
  //       lat: polylineDragMarker.getLatLng().lat,
  //       lon: polylineDragMarker.getLatLng().lng,
  //     };

  //     // ! Rewrite
  //     let waypoints = getLineUnderConstruction().busLine
  //       .waypoints as WaypointType[];
  //     waypoints = [...waypoints];
  //     console.log("oldWaypoint =>", waypoints);
  //     waypoints.splice(props.indexPointBefore + 1, 0, newWaypoint); // ! Fix indexPointBeforeValue
  //     console.log("new Waypoint =>", waypoints);

  //     setLineUnderConstruction({
  //       ...getLineUnderConstruction(),
  //       busLine: {
  //         ...getLineUnderConstruction().busLine,
  //         waypoints: waypoints,
  //       },
  //     });

  //     updatePolylineWithOsrm(getLineUnderConstruction().busLine);

  //     document.removeEventListener("mouseup", handleMouseUp);
  //   }
  //   document.addEventListener("mouseup", handleMouseUp);
  // }

  // // eslint-disable-next-line solid/reactivity
  // const polylineDragMarker = L.marker(props.latlngs, {
  //   icon: dragMarkerIcon,
  //   pane: "markerPane",
  //   keyboard: false,
  // }).on("mousedown", onMouseDown);

  // eslint-disable-next-line solid/reactivity
  const polylineDragMarker = L.marker(props.latlngs, {
    icon: dragMarkerIcon,
    pane: "markerPane",
    draggable: true,
    keyboard: false,
    // ! externalise the function
    // eslint-disable-next-line solid/reactivity
  }).on("dragend", (e) => {
    console.log("dragend polylineDragMarker=>", e);
    const newWaypoint: WaypointType = {
      lat: polylineDragMarker.getLatLng().lat,
      lon: polylineDragMarker.getLatLng().lng,
    };
    // ! Rewrite
    let waypoints = getLineUnderConstruction().busLine
      .waypoints as WaypointType[];
    waypoints = [...waypoints];
    console.log("oldWaypoint =>", waypoints);
    waypoints.splice(props.indexPointBefore + 1, 0, newWaypoint); // ! Fix indexPointBeforeValue
    console.log("new Waypoint =>", waypoints);

    setLineUnderConstruction({
      ...getLineUnderConstruction(),
      busLine: {
        ...getLineUnderConstruction().busLine,
        waypoints: waypoints,
      },
    });

    updatePolylineWithOsrm(getLineUnderConstruction().busLine);
  });
  // .on("dragstart", (e) => {
  //   console.log("e=>", e);
  // })

  // eslint-disable-next-line solid/reactivity
  polylineDragMarker.addTo(props.map);

  // createEffect(() => {
  //   if (displayPolylineDragMarkers()) {
  //     props.map.addLayer(polylineDragMarker);
  //   } else if (!displayPolylineDragMarkers()) {
  //     props.map.removeLayer(polylineDragMarker);
  //   }
  // });

  onCleanup(() => {
    polylineDragMarker.remove();
  });
  return <></>;
}
