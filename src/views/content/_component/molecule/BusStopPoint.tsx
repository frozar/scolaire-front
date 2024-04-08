import L from "leaflet";
import { createSignal } from "solid-js";
import { BusStopType } from "../../../../_entities/busStops.entity";
import Point from "../../map/component/atom/Point";
import { COLOR_STOP_FOCUS } from "../../map/constant";

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

  return (
    <Point
      point={props.point}
      map={props.map}
      isBlinking={false}
      borderColor={COLOR_STOP_FOCUS}
      fillColor={"#0000aa"}
      radius={10}
      weight={0}
      onClick={() => console.log()}
      onMouseOver={() => console.log()}
      onMouseOut={() => console.log()}
      onRightClick={() => console.log()}
      onMouseUp={() => console.log()}
    />
  );
}
