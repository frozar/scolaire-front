import { onMount, For, onCleanup, createEffect } from "solid-js";

import LineDisplay from "./LineDisplay";
import { fetchBusLines, setBusLines, busLines } from "../signaux";
import { done } from "../PointsRamassageAndEtablissement";
export default function BusLines() {
  // onMount(() => {
  //   fetchBusLines();
  // });
  createEffect(() => {
    if (done()) {
      fetchBusLines();
      console.log("done");
    }
  });

  onCleanup(() => {
    setBusLines([]);
  });

  return <For each={busLines()}>{(line) => <LineDisplay line={line} />}</For>;
}
