import { For, Show, createSignal, onMount } from "solid-js";
import { BusStopType } from "../../../../_entities/busStops.entity";
import { SchoolType } from "../../../../_entities/school.entity";
import { StopType } from "../../../../_entities/stop.entity";
import CollapsibleElement from "../../line/atom/CollapsibleElement";

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
