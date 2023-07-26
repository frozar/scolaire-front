import { Show } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { PointIdentityType } from "../../../../../type";
import { getLatLngs } from "../../line/busLinesUtils";
import Line from "../atom/Line";
import LineTip from "../molecule/LineTip";
const [, { getLineUnderConstruction }] = useStateAction();
interface LineUnderConstructionProps {
  leafletMap: L.Map;
  stops: PointIdentityType[];
}
export default function (props: LineUnderConstructionProps) {
  const color = "blue";
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
      <LineTip
        latlng={getLatLngs(props.stops).at(-1) as L.LatLng}
        leafletMap={props.leafletMap}
        color={color}
        opacity={opacity}
      />
    </Show>
  );
}
