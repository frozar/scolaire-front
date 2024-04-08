import { For, createSignal, onMount } from "solid-js";
import { BusStopType } from "../../../../../_entities/busStops.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { getBusStops } from "../../../../../_stores/busStop.store";
import Button from "../../../../../component/atom/Button";
import { ViewManager } from "../../../ViewManager";
import CollapsibleElement from "../../../line/atom/CollapsibleElement";

export function SchoolBusStops(props: { school: SchoolType }) {
  const [schoolBusStops, setSchoolBusStops] = createSignal<BusStopType[]>([]);

  onMount(() => {
    const busStops = getBusStops().filter((item) => {
      if (props.school.busStops.includes(item.id as number)) return item;
    });
    setSchoolBusStops(busStops);
  });

  return (
    <CollapsibleElement title="Arrêts de bus">
      <Button label="Ajouter" onClick={() => ViewManager.busStopAdd()} />
      <For each={schoolBusStops()}>
        {(stopItem) => <div>{stopItem.name}</div>}
      </For>
    </CollapsibleElement>
  );
}
