import L from "leaflet";
import { createSignal, onMount } from "solid-js";
import { BusStopType } from "../../../../_entities/busStops.entity";
import Point from "../../map/component/atom/Point";
import { displayStopName } from "../../map/component/organism/MapOptionsPanel";
import { COLOR_BLUE_BASE } from "../../map/constant";
import { leafletMap } from "../template/MapContainer";
import "./MapPoint.css";

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

  const tooltip = L.tooltip({
    className: "point-tooltip",
    opacity: 1,
    direction: "top",
  });

  onMount(() => {
    const pos = L.latLng(props.point.lat, props.point.lon);
    tooltip.setLatLng(pos);
    tooltip.setContent(props.point.name);
  });

  function mouseOver() {
    if (displayStopName()) tooltip.addTo(leafletMap() as L.Map);
  }

  function mouseOut() {
    if (displayStopName()) tooltip.removeFrom(leafletMap() as L.Map);
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
      onClick={() => console.log()}
      onMouseOver={mouseOver}
      onMouseOut={mouseOut}
      onRightClick={() => console.log()}
      onMouseUp={() => console.log()}
    />
  );
}
