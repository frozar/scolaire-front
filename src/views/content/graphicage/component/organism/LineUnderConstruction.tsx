import L from "leaflet";
import { Show } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { COLOR_LINE_UNDER_CONSTRUCTION } from "../../constant";

import Line from "../atom/Line";
import { linkMap } from "./Points";
import { LeafletSchoolType } from "./SchoolPoints";
import { LeafletStopType } from "./StopPoints";
const [, { getLineUnderConstruction }] = useStateAction();
interface LineUnderConstructionProps {
  leafletMap: L.Map;
  stops: (LeafletStopType | LeafletSchoolType)[];
}
export default function (props: LineUnderConstructionProps) {
  const color = COLOR_LINE_UNDER_CONSTRUCTION;
  const opacity = 1;

  return (
    <Show when={getLineUnderConstruction().stops.length > 0}>
      <Show when={getLineUnderConstruction().stops.length > 1}>
        <Line
          latlngs={getLatLngs(props.stops)}
          leafletMap={props.leafletMap}
          color={color}
          opacity={opacity}
        />
      </Show>
      {/* TODO delete lineTip or rethink fonctionnality */}
      {/* <LineTip
        latlng={getLatLngs(props.stops).at(-1) as L.LatLng}
        leafletMap={props.leafletMap}
        color={color}
        opacity={opacity}
      /> */}
    </Show>
  );
}

// TODO to refactor ?
function getLatLngs(
  stops: (LeafletStopType | LeafletSchoolType)[]
): L.LatLng[] {
  const latlngs: L.LatLng[] = [];

  // TODO: linkMap must be reactive => signal

  for (const pointIdentity of stops) {
    const circle = linkMap.get(pointIdentity.leafletId);
    if (circle) {
      latlngs.push(circle.getLatLng());
    }
  }

  return latlngs;
}
