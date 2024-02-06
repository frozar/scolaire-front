import L, { LeafletMouseEvent } from "leaflet";
import { createEffect, createSignal } from "solid-js";

import { step } from "../../../../../_services/osrm.service";
import { COLOR_GREEN_BASE } from "../../constant";
import Line from "../atom/Line";

export function LineWeight(props: {
  way: step;
  map: L.Map;
  lineColor?: string;
}) {
  const [localLatLngs, setLocalLatLngs] = createSignal<L.LatLng[]>([]);
  const [localOpacity, setLocalOpacity] = createSignal<number>(1);
  createEffect(() => setLocalLatLngs(test()));

  const onMouseOver = (polyline: L.Polyline, arrows: L.Marker[]) => {
    console.log("onMouseOver");
  };

  const onMouseOut = (polyline: L.Polyline, arrows: L.Marker[]) => {
    console.log("onMouseOut");
  };
  const onMouseDown = (e: LeafletMouseEvent) => {
    console.log("onMouseDown");
  };

  const onClick = () => {
    console.log("onMouseOut");
  };
  return (
    <>
      <Line
        latlngs={localLatLngs() ?? []}
        leafletMap={props.map}
        color={props.lineColor ?? COLOR_GREEN_BASE}
        opacity={localOpacity()}
        lineId={props.way.flaxib_way_id}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={onClick}
        onMouseDown={onMouseDown}
      />
    </>
  );

  function test(): L.LatLng[] {
    console.log(props.way.coordinates);
    return props.way.coordinates ?? [];
  }
}
