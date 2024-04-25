import { For, Show, createSignal, onMount } from "solid-js";
import { BusStopType } from "../../../../_entities/busStops.entity";
import { SchoolType } from "../../../../_entities/school.entity";
import { StopType } from "../../../../_entities/stop.entity";
import { BusStopCard } from "../molecule/BusStopCard";
import "./BusStopsDisplay.css";

interface BusStopsDisplayProps {
  item: SchoolType | StopType;
}

export function BusStopsDisplay(props: BusStopsDisplayProps) {
  const [busStopsItems, setBusStopsItems] = createSignal<BusStopType[]>([]);

  onMount(() => {
    if (props.item.busStops) {
      setBusStopsItems(props.item.busStops);
    }
  });

  return (
    <div>
      <p>Arrêts de bus</p>
      <Show
        when={busStopsItems().length > 0}
        fallback={<div class="bus-stop-display-offset">Aucun arrêt de bus</div>}
      >
        <For each={busStopsItems()}>
          {(stopItem) => <BusStopCard busStop={stopItem} />}
        </For>
      </Show>
    </div>
  );
}
