import { createSignal, onMount, For, onCleanup, createEffect } from "solid-js";

import LineDisplay from "./LineDisplay";
import { busLines, fetchBusLines, setBusLines } from "./signaux";

export default function BusLines() {
  onMount(() => {
    fetchBusLines();
  });

  onCleanup(() => {
    setBusLines([]);
  });

  return <For each={busLines()}>{(line) => <LineDisplay line={line} />}</For>;
}
