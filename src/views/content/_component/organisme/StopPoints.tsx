import L from "leaflet";
import { For, createSignal } from "solid-js";
import { StopType } from "../../../../_entities/stop.entity";
import { StopPoint } from "../../map/component/molecule/StopPoint";

export const [displayStops, setDisplayStops] = createSignal<StopType[]>([]);
export function StopPoints(props: { map: L.Map }) {
  const quantities = () => {
    return displayStops().map((stop) => {
      return stop.associated.reduce((acc, stop) => acc + stop.quantity, 0);
    }) as number[];
  };

  const minQuantity = () => {
    const minCandidat = Math.min(...quantities());
    return Number.isFinite(minCandidat) ? minCandidat : 0;
  };

  const maxQuantity = () => {
    const maxCandidat = Math.max(...quantities());
    return Number.isFinite(maxCandidat) ? maxCandidat : 0;
  };
  return (
    <For each={displayStops()}>
      {(stop) => {
        return (
          <StopPoint
            point={stop}
            map={props.map}
            minQuantity={minQuantity()}
            maxQuantity={maxQuantity()}
          />
        );
      }}
    </For>
  );
}
