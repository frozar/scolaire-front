import { onCleanup, createEffect, createSignal } from "solid-js";
import { pointsReady } from "../../../../views/content/graphicage/PointsRamassageAndEtablissement";
import { fetchBusLines } from "./busLinesUtils";
import { LineType } from "../../../../type";
import { points } from "../../../../signaux";

export const [busLines, setBusLines] = createSignal<LineType[]>([]);

export default function () {
  createEffect(() => {
    if (pointsReady()) {
      console.log("points()", points());

      fetchBusLines();
    }
  });

  onCleanup(() => {
    setBusLines([]);
  });

  return <></>;
}
