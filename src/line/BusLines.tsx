import { For, onCleanup, createEffect } from "solid-js";

import LineDisplay from "./LineDisplay";
import { fetchBusLines, setBusLines, busLines } from "../signaux";
import { pointsReady } from "../PointsRamassageAndEtablissement";
export default function BusLines() {
  createEffect(() => {
    if (pointsReady()) {
      fetchBusLines();
    }
  });

  onCleanup(() => {
    setBusLines([]);
  });

  return <For each={busLines()}>{(line) => <LineDisplay line={line} />}</For>;
}
