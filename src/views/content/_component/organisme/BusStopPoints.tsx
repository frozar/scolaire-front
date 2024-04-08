import L from "leaflet";
import { For, createSignal } from "solid-js";
import { BusStopType } from "../../../../_entities/busStops.entity";
import { BusStopPoint } from "../molecule/BusStopPoint";

export const [displayBusStops, setDisplayBusStops] = createSignal<
  BusStopType[]
>([]);

export function BusStopPoints(props: { map: L.Map }) {
  return (
    <For each={displayBusStops()}>
      {(stop) => {
        return <BusStopPoint map={props.map} point={stop} />;
      }}
    </For>
  );
}
