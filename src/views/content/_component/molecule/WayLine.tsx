import { LatLng } from "leaflet";
import { createEffect, createSignal } from "solid-js";
import { WayType } from "../../../../_entities/way.entity";
import Line from "../../map/component/atom/Line";
import { COLOR_BLUE_BASE, COLOR_GREEN_BASE } from "../../map/constant";
import { selectedWays, setSelectedWays } from "../../paths/template/PathAdd";

export const [wayLineColor, setWayLineColor] =
  createSignal<string>(COLOR_GREEN_BASE);

export const [wayLineOpacity, setWaylineOpacity] = createSignal<number>(1);

export function WayLine(props: { way: WayType; map: L.Map }) {
  const [localColor, setLocalColor] = createSignal("");
  const [localOpacity, setLocalOpacity] = createSignal(0);
  createEffect(() => setLocalColor(wayLineColor()));
  createEffect(() => setLocalOpacity(wayLineOpacity()));

  function addWay() {
    console.log(props.way);
    // eslint-disable-next-line solid/reactivity
    setSelectedWays((prev) => {
      return [...prev, props.way];
    });
    setLocalColor(COLOR_BLUE_BASE);
  }

  function mouseOver() {
    if (selectedWays().includes(props.way)) {
      setLocalColor(COLOR_BLUE_BASE);
      return;
    }
    setLocalOpacity(1);
    setLocalColor(COLOR_GREEN_BASE);
  }

  function mouseOut() {
    if (selectedWays().includes(props.way)) {
      setLocalColor(COLOR_BLUE_BASE);
      return;
    }
    setLocalOpacity(wayLineOpacity());
    setLocalColor(wayLineColor());
  }

  return (
    <Line
      latlngs={props.way.coordinates as LatLng[]}
      leafletMap={props.map}
      color={localColor()}
      opacity={localOpacity()}
      lineId={props.way.id}
      withArrows={false}
      onMouseOver={mouseOver}
      onMouseOut={mouseOut}
      onClick={addWay}
      onMouseDown={() => console.log()}
    />
  );
}
