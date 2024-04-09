import { For, Show, createSignal, onMount } from "solid-js";
import { BusStopType } from "../../../../_entities/busStops.entity";
import { SchoolType } from "../../../../_entities/school.entity";
import { StopType } from "../../../../_entities/stop.entity";
import { getBusStops } from "../../../../_stores/busStop.store";
import CollapsibleElement from "../../line/atom/CollapsibleElement";

interface BusStopsDisplayProps {
  item: SchoolType | StopType;
}

export function BusStopsDisplay(props: BusStopsDisplayProps) {
  const [busStopsItems, setBusStopsItems] = createSignal<BusStopType[]>([]);

  onMount(() => {
    setBusStopsItems(
      getBusStops().filter((busstop) =>
        props.item.busStops.includes(busstop.id as number)
      )
    );
  });

  return (
    <CollapsibleElement title="Arrêts de bus">
      <Show
        when={busStopsItems().length > 0}
        fallback={<div>Aucun arrêt de bus</div>}
      >
        <For each={busStopsItems()}>
          {(stopItem) => <div>{stopItem.name}</div>}
        </For>
      </Show>
    </CollapsibleElement>
  );
}
