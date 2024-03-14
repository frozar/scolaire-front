import { LatLng } from "leaflet";
import { createSignal } from "solid-js";
import { WayType } from "../../../../_entities/way.entity";
import Line from "../../map/component/atom/Line";
import { COLOR_GREEN_BASE } from "../../map/constant";
import { setSelectedPaths } from "../../paths/template/PathAdd";

export const [wayLineColor, setWayLineColor] =
  createSignal<string>(COLOR_GREEN_BASE);

export const [wayLineOpacity, setWaylineOpacity] = createSignal<number>(1);

export function WayLine(props: { way: WayType; map: L.Map }) {
  function addWay() {
    console.log(props.way);
    // eslint-disable-next-line solid/reactivity
    setSelectedPaths((prev) => {
      return [...prev, props.way.id];
    });
  }

  return (
    <Line
      latlngs={props.way.coordinates as LatLng[]}
      leafletMap={props.map}
      color={wayLineColor()}
      opacity={wayLineOpacity()}
      lineId={props.way.id}
      withArrows={false}
      onMouseOver={() => console.log()}
      onMouseOut={() => console.log()}
      onClick={addWay}
      onMouseDown={() => console.log()}
    />
  );
}
