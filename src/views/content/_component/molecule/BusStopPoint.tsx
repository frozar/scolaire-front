import L from "leaflet";
import { createSignal } from "solid-js";
import { BusStopType } from "../../../../_entities/busStops.entity";
import { COLOR_BLUE_BASE } from "../../map/constant";
import Point from "../atom/Point";

export const [busStopPointOnClick, setBusStopPointOnClick] = createSignal<
  ((stop: BusStopType) => void) | undefined
>();

export interface BusStopPointProps {
  point: BusStopType;
  map: L.Map;
}

export function BusStopPoint(props: BusStopPointProps) {
  // function onClick(stop: BusStopType) {
  //   if (busStopPointOnClick()) {
  //     (busStopPointOnClick() as (stop: BusStopType) => void)(stop);
  //   } else {
  //     ViewManager.stopDetails(stop);
  //   }
  // }
  function tooltip() {
    if (!props.point.name) return undefined;
    const tooltip = L.tooltip({
      className: "point-tooltip",
      opacity: 1,
      direction: "top",
    });
    const pos = L.latLng(props.point.lat, props.point.lon);
    tooltip.setLatLng(pos);
    tooltip.setContent(props.point.name);
    return tooltip;
  }

  return (
    <Point
      point={props.point}
      map={props.map}
      isBlinking={false}
      borderColor={COLOR_BLUE_BASE}
      fillColor={"#0000aa"}
      radius={10}
      weight={2}
      tootlip={tooltip()}
      onClick={() => console.log()}
      onMouseOver={() => console.log()}
      onMouseOut={() => console.log()}
      onRightClick={() => console.log()}
      onMouseUp={() => console.log()}
    />
  );
}
