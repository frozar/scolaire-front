import { JSXElement, createSignal, onMount } from "solid-js";

import { OsrmService } from "../../../../_services/osrm.service";
import { disableSpinningWheel, enableSpinningWheel } from "../../../../signaux";
import { BusServiceUtils } from "../../../../utils/busService.utils";
import { HlpMatrixType } from "../../../../utils/serviceGrid.utils";
import { FlatGraphics } from "../organism/FlatGraphics";
import "./ServiceTemplate.css";

export const [selectedService, setSelectedService] = createSignal<number>();
export const [hlpMatrix, setHlpMatrix] = createSignal<HlpMatrixType>({});

export function ServiceTemplate(): JSXElement {
  onMount(async () => {
    enableSpinningWheel();

    const { latLngs, tripIds } = BusServiceUtils.getStartAndEndTripLatLngs();

    if (tripIds.length == 0) {
      disableSpinningWheel();
      return;
    }

    const durations = await OsrmService.getHlpMatrix(latLngs);

    setHlpMatrix(() => {
      const finalDict: HlpMatrixType = {};

      // TODO: Simplify
      for (let i = 0; i < durations.length; i += 2) {
        const sourceTripId = tripIds[i / 2];
        finalDict[sourceTripId] = {};

        for (let j = 0; j < durations.length; j += 2) {
          const targetTripId = tripIds[j / 2];
          if (sourceTripId == targetTripId) continue;

          finalDict[sourceTripId][targetTripId] = Math.round(
            durations[i][j + 1] / 60
          );
        }
      }
      return finalDict;
    });

    disableSpinningWheel();
  });

  return (
    <div id="service-template">
      <FlatGraphics />
      {/* <ServiceLeftBoard /> */}
      {/* TODO créer le composant FlatGraphic qui englobera une liste de <Services>*/}
      {/* <Services /> */}
    </div>
  );
}
