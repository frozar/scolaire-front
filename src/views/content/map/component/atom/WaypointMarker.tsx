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

// const locationDotIcon =
//   "<svg fill='blue' stroke-width='0' xmlns='http://www.w3.org/2000/svg' viewBox='120 445 384 512' height='2em' width='2em' style='overflow: visible;'><path d='M215.7 499.2C267 435 384 279.4 384 192 384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2 12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z'></path></svg>";

const locationDotIcon =
  "<svg fill='#0cc683' stroke='black' stroke-width='1' xmlns='http://www.w3.org/2000/svg' viewBox='100 300 320 512' height='2em' width='2em' style='overflow: visible;'><path d='M16 144a144 144 0 1 1 288 0 144 144 0 1 1-288 0zm144-64c8.8 0 16-7.2 16-16s-7.2-16-16-16c-53 0-96 43-96 96 0 8.8 7.2 16 16 16s16-7.2 16-16c0-35.3 28.7-64 64-64zm-32 400V317.1a177.984 177.984 0 0 0 64 0V480c0 17.7-14.3 32-32 32s-32-14.3-32-32z'></path></svg>";

// const locationDotIcon =
//   "<svg fill='#0cc683' stroke-width='0' xmlns='http://www.w3.org/2000/svg' viewBox='4 5 16 16' height='2em' width='2em' style='overflow: visible;'><path d='M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354z'></path></svg>";

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
