import { Show } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { COLOR_LINE_UNDER_CONSTRUCTION } from "../../constant";
import { getLatLngs } from "../../line/busLinesUtils";
import Line from "../atom/Line";
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
      {/* TODO delete lineTip */}
      {/* <LineTip
        latlng={getLatLngs(props.stops).at(-1) as L.LatLng}
        leafletMap={props.leafletMap}
        color={color}
        opacity={opacity}
      /> */}
    </Show>
  );
}
