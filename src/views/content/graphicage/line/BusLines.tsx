import { onCleanup, createEffect } from "solid-js";
import { fetchBusLines, setBusLines } from "../../../../signaux";
import { pointsReady } from "../../../../views/content/graphicage/PointsRamassageAndEtablissement";

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
