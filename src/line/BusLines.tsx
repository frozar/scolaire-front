import { onMount, For, onCleanup } from "solid-js";

import LineDisplay from "./LineDisplay";
import { fetchBusLines, setBusLines, busLines } from "../signaux";

export default function BusLines() {
  onMount(() => {
    fetchBusLines();
  });

  onCleanup(() => {
    setBusLines([]);
  });

  return <For each={busLines()}>{(line) => <LineDisplay line={line} />}</For>;
}
