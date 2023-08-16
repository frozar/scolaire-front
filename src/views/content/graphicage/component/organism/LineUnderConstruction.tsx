import L from "leaflet";
import { Show, createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { COLOR_LINE_UNDER_CONSTRUCTION } from "../../constant";

import { BusLinePointType } from "../../../../../_entities/bus-line.entity";
import Line from "../atom/Line";
import { linkMap } from "./Points";
const [, { getLineUnderConstruction }] = useStateAction();
interface LineUnderConstructionProps {
  leafletMap: L.Map;
  stops: BusLinePointType[];
}
export const [localLatLngs, setLocalLatLngs] = createSignal<L.LatLng[]>([]);
const [localOpacity, setLocalOpacity] = createSignal<number>(1);

export default function (props: LineUnderConstructionProps) {
  const color = COLOR_LINE_UNDER_CONSTRUCTION;

  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    // const latlngs: L.LatLng[] = await OsrmService.getRoadPolyline(line.points);

    if (getLineUnderConstruction().busLine.latLngs().length === 0) {
      setLocalLatLngs(getLatLngs(props.stops));
    } else {
      setLocalLatLngs(getLineUnderConstruction().busLine.latLngs());
    }
    setLocalOpacity(1);
  });

  return (
    <Show when={getLineUnderConstruction().busLine.points.length > 0}>
      <Show when={getLineUnderConstruction().busLine.points.length > 1}>
        <Line
          latlngs={localLatLngs()}
          leafletMap={props.leafletMap}
          color={color}
          opacity={localOpacity()}
        />
      </Show>
      {/* TODO delete lineTip or rethink fonctionnality */}
      {/* <LineTip
        latlng={getLatLngs(props.stops).at(-1) as L.LatLng}
        leafletMap={props.leafletMap}
        color={color}
        opacity={opacity}
      /> */}
    </Show>
  );
}

// TODO to refactor ?
function getLatLngs(stops: BusLinePointType[]): L.LatLng[] {
  const latlngs: L.LatLng[] = [];

  // TODO: linkMap must be reactive => signal

  for (const pointIdentity of stops) {
    const circle = linkMap.get(pointIdentity.leafletId);
    if (circle) {
      latlngs.push(circle.getLatLng());
    }
  }

  return latlngs;
}
