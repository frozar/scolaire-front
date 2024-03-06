import L from "leaflet";
import { createEffect, createSignal } from "solid-js";

import { step } from "../../../../../_services/osrm.service";
import { resetNewWeight } from "../../../stops/component/organism/VoirieItems";
import Line from "../atom/Line";

export const [getSelectedWays, setSelectedWays] = createSignal<step[]>([]);

export function LineWeight(props: {
  way: step;
  map: L.Map;
  lineColor: string;
  opacity?: number;
}) {
  const [localLatLngs, setLocalLatLngs] = createSignal<L.LatLng[]>([]);
  const [localOpacity, setLocalOpacity] = createSignal<number>(1);
  createEffect(() => setLocalLatLngs(props.way.coordinates ?? []));
  createEffect(() => setLocalOpacity(props.opacity ?? 1));

  const onMouseOver = () => {
    // console.log("onMouseOver " + props.way.flaxib_way_id);
    // setLocalColor(COLOR_BLUE_BASE);
  };

  const onMouseOut = () => {
    // console.log("onMouseOut");
    // setLocalColor(props.lineColor ?? COLOR_GREEN_BASE);
  };
  const onMouseDown = () => {
    // console.log("onMouseDown");
  };

  const onClick = () => {
    if (window.event?.ctrlKey) {
      if (
        getSelectedWays().filter(
          (way) => way.flaxib_way_id === props.way.flaxib_way_id
        ).length > 0
      ) {
        setSelectedWays((prev) =>
          prev.filter((way) => way.flaxib_way_id != props.way.flaxib_way_id)
        );
      } else {
        setSelectedWays((prev) => [...prev, props.way]);
      }
      //ctrl was held down during the click
    } else {
      setSelectedWays(
        //TODO Modify onclick to use ways() signal
        // ways().filter((elem) => elem.flaxib_way_id === props.way.flaxib_way_id)[0]
        [props.way]
      );
    }
    resetNewWeight();
  };
  return (
    <>
      <Line
        latlngs={localLatLngs() ?? []}
        leafletMap={props.map}
        color={props.lineColor}
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
