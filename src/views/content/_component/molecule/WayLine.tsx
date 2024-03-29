import { LatLng } from "leaflet";
import { createEffect, createSignal, onMount } from "solid-js";
import { WayType } from "../../../../_entities/way.entity";
import Line from "../../map/component/atom/Line";
import {
  COLOR_BLUE_BASE,
  COLOR_GREEN_BASE,
  COLOR_RED_BASE,
} from "../../map/constant";
import { selectedWays, setSelectedWays } from "../../paths/template/PathAdd";
import { editways, setEditWays } from "../../paths/template/PathEdit";
import { mapBoard } from "../template/MapBoardManager";

export const [wayLineColor, setWayLineColor] =
  createSignal<string>(COLOR_GREEN_BASE);

export const [wayLineOpacity, setWaylineOpacity] = createSignal<number>(1);

export function WayLine(props: { way: WayType; map: L.Map }) {
  const [localColor, setLocalColor] = createSignal("");
  const [localOpacity, setLocalOpacity] = createSignal(0);
  createEffect(() => setLocalColor(wayLineColor()));
  createEffect(() => setLocalOpacity(wayLineOpacity()));

  onMount(() => {
    if (selectedWays().includes(props.way) || editways().includes(props.way)) {
      if (props.way.selected) {
        setLocalColor(COLOR_RED_BASE);
        return;
      }
      setLocalColor(COLOR_BLUE_BASE);
      return;
    }
    setLocalOpacity(wayLineOpacity());
    setLocalColor(wayLineColor());
  });

  function addWay() {
    if (mapBoard() == "path-edit") {
      // eslint-disable-next-line solid/reactivity
      setEditWays((prev) => {
        return [...prev, props.way];
      });
    }
    if (mapBoard() == "path-add") {
      // eslint-disable-next-line solid/reactivity
      setSelectedWays((prev) => {
        return [...prev, props.way];
      });
    }
    setLocalColor(COLOR_BLUE_BASE);
  }

  function mouseOver() {
    if (selectedWays().includes(props.way) || editways().includes(props.way)) {
      if (props.way.selected) {
        setLocalColor(COLOR_RED_BASE);
        return;
      }
      setLocalColor(COLOR_BLUE_BASE);
      return;
    }
    setLocalOpacity(1);
    setLocalColor(COLOR_GREEN_BASE);
  }

  function mouseOut() {
    if (selectedWays().includes(props.way) || editways().includes(props.way)) {
      if (props.way.selected) {
        setLocalColor(COLOR_RED_BASE);
        return;
      }
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
