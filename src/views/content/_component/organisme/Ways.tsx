import L from "leaflet";
import { For, createEffect, createSignal } from "solid-js";
import { WayType } from "../../../../_entities/way.entity";
import { WayLine } from "../molecule/WayLine";

export const [displayWays, setDisplayWays] = createSignal<WayType[]>([]);

export function Ways(props: { map: L.Map }) {
  createEffect(() => {
    if (displayWays().length != 0) console.log("Ways", displayWays()[0]);
  });

  return (
    <section>
      <For each={displayWays()}>
        {(way) => {
          return <WayLine way={way} map={props.map} />;
        }}
      </For>
    </section>
  );
}
