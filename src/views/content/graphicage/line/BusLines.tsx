import { onCleanup, createEffect, createSignal } from "solid-js";
// import { setBusLines } from "../../../../signaux";
import { pointsReady } from "../../../../views/content/graphicage/PointsRamassageAndEtablissement";
import { fetchBusLines } from "./busLinesUtils";
import { LineType } from "../../../../type";

export const [busLines, setBusLines] = createSignal<LineType[]>([]);

export default function () {
  createEffect(() => {
    if (pointsReady()) {
      fetchBusLines();
    }
  });

  onCleanup(() => {
    setBusLines([]);
  });

  return <></>;
}
