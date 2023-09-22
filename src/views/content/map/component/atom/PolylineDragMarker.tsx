import L from "leaflet";
import { onCleanup } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import {
  BusLineType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-line.entity";
import { WaypointEntity } from "../../../../../_entities/waypoint.entity";

const [, { getLineUnderConstruction }] = useStateAction();

type PolylineDragMarkersProps = {
  map: L.Map;
  latlngs: L.LatLng;
  index: number;
};
const dotIcon =
  "<svg fill='none' stroke-width='2' xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-point-filled' width='1em' height='1em' viewBox='0 0 24 24' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' style='overflow: visible;'><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z' stroke-width='0' fill='black'></path></svg>";

export default function (props: PolylineDragMarkersProps) {
  const dragMarkerIcon = L.divIcon({
    className: "dragMarker",
    html: dotIcon,
  });

  // eslint-disable-next-line solid/reactivity
  const polylineDragMarker = L.marker(props.latlngs, {
    icon: dragMarkerIcon,
    pane: "shadowPane",
    draggable: true,
    keyboard: false,
    // eslint-disable-next-line solid/reactivity
  }).on("dragend", () => {
    const waypoints = getLineUnderConstruction().busLine.waypoints;
    if (!waypoints) {
      return;
    }

    const newWaypoints = WaypointEntity.createWaypoints(
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
  });

  polylineDragMarker.setOpacity(0);

  polylineDragMarker.on("mouseover", function () {
    polylineDragMarker.setOpacity(100);
  });

  polylineDragMarker.on("mouseout", function () {
    polylineDragMarker.setOpacity(0);
  });
  // eslint-disable-next-line solid/reactivity
  polylineDragMarker.addTo(props.map);

  onCleanup(() => {
    polylineDragMarker.remove();
  });
  return <></>;
}
