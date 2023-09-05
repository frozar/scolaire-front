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
  index: number;
};

const locationDotIcon =
  "<svg fill='blue' stroke-width='0' xmlns='http://www.w3.org/2000/svg' viewBox='120 445 384 512' height='2em' width='2em' style='overflow: visible;'><path d='M215.7 499.2C267 435 384 279.4 384 192 384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2 12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z'></path></svg>";

export default function (props: PolylineDragMarkersProps) {
  const waypointMarkerIcon = L.divIcon({
    className: "dragMarker",
    html: locationDotIcon,
  });

  function onRightClick() {
    const waypoints = [
      ...(getLineUnderConstruction().busLine.waypoints as WaypointType[]),
    ];
    waypoints.splice(props.index, 1);

    setLineUnderConstruction({
      ...getLineUnderConstruction(),
      busLine: {
        ...getLineUnderConstruction().busLine,
        waypoints: waypoints,
      },
    });
    updatePolylineWithOsrm(getLineUnderConstruction().busLine);
  }
  // eslint-disable-next-line solid/reactivity
  const waypointMarker = L.marker(props.latlngs, {
    icon: waypointMarkerIcon,
    pane: "markerPane",
    keyboard: false,
  }).on("contextmenu", onRightClick);

  // eslint-disable-next-line solid/reactivity
  waypointMarker.addTo(props.map);

  onCleanup(() => {
    waypointMarker.remove();
  });
  return <></>;
}
