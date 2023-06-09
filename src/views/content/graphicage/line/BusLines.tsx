import { onCleanup, createEffect } from "solid-js";
import { setBusLines } from "../../../../signaux";
import { pointsReady } from "../../../../views/content/graphicage/PointsRamassageAndEtablissement";
import { fetchBusLines } from "./BusLinesFunction";

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
