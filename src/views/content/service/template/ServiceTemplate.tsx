import { JSXElement, createSignal, onMount } from "solid-js";
import { ServiceLeftBoard } from "../organism/ServiceLeftBoard";
import { Services } from "../organism/Services";

import { OsrmService } from "../../../../_services/osrm.service";
import { BusServiceUtils } from "../../../../utils/busService.utils";
import "./ServiceTemplate.css";

// TODO: Explain
type HlpMatrixType = {
  [sourceTripId: number]: { [targetTripId: number]: number };
};

export const [selectedService, setSelectedService] = createSignal<number>();
export const [hlpMatrix, setHlpMatrix] = createSignal<HlpMatrixType>({});

export function ServiceTemplate(): JSXElement {
  onMount(async () => {
    // TODO: Afficher spinning wheel !
    const { latLngs, tripIds } = BusServiceUtils.getStartAndEndTripLatLngs();
    const durations = await OsrmService.getHlpMatrix(latLngs);

    console.log("durations", durations);
    console.log("tripIds", tripIds);

    // TODO: Clean
    setHlpMatrix(() => {
      const finalDict: HlpMatrixType = {};

      for (let i = 0; i < durations.length; i += 2) {
        console.log("i", i);

        const sourceTripId = tripIds[i / 2];
        finalDict[sourceTripId] = {};

        for (let j = 0; j < durations.length; j += 2) {
          console.log("j", j);

          const targetTripId = tripIds[j / 2];
          if (sourceTripId == targetTripId) continue;

          finalDict[sourceTripId][targetTripId] = Math.round(
            durations[i][j + 1] / 60
          );
        }
      }
      console.log("finalDict", finalDict);
      return finalDict;
    });
  });
  return (
    <div id="service-template">
      <ServiceLeftBoard />
      <Services />
    </div>
  );
}
