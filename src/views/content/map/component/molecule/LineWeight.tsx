import L from "leaflet";
import { createEffect, createSignal } from "solid-js";

import { step } from "../../../../../_services/osrm.service";
import { resetCurrentWeight } from "../../../stops/component/organism/VoirieDay";
import { setSelectedWay } from "../../../stops/component/organism/WayDetails";
import { COLOR_BLUE_BASE, COLOR_GREEN_BASE } from "../../constant";
import Line from "../atom/Line";

export function LineWeight(props: {
  way: step;
  map: L.Map;
  lineColor?: string;
  opacity?: number;
}) {
  const [localLatLngs, setLocalLatLngs] = createSignal<L.LatLng[]>([]);
  const [localOpacity, setLocalOpacity] = createSignal<number>(1);
  const [localColor, setLocalColor] = createSignal<string>(COLOR_GREEN_BASE);
  createEffect(() => setLocalLatLngs(props.way.coordinates ?? []));
  createEffect(() => setLocalOpacity(props.opacity ?? 1));
  createEffect(() => setLocalColor(props.lineColor ?? COLOR_GREEN_BASE));

  const onMouseOver = () => {
    // console.log("onMouseOver " + props.way.flaxib_way_id);
    setLocalColor(COLOR_BLUE_BASE);
  };

  const onMouseOut = () => {
    // console.log("onMouseOut");
    setLocalColor(props.lineColor ?? COLOR_GREEN_BASE);
  };
  const onMouseDown = () => {
    // console.log("onMouseDown");
  };

  const onClick = () => {
    setSelectedWay(props.way);
    resetCurrentWeight();
    console.log("onClick", props.way);
  };
  return (
    <>
      <Line
        latlngs={localLatLngs() ?? []}
        leafletMap={props.map}
        color={localColor()}
        opacity={localOpacity()}
        lineId={props.way.flaxib_way_id}
        withArrows={false}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={onClick}
        onMouseDown={onMouseDown}
      />
    </>
  );
}
