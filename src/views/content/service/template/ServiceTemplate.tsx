import { JSXElement, createSignal, onMount } from "solid-js";
import { ServiceLeftBoard } from "../organism/ServiceLeftBoard";
import { Services } from "../organism/Services";

import { OsrmService } from "../../../../_services/osrm.service";
import { BusServiceUtils } from "../../../../utils/busService.utils";
import "./ServiceTemplate.css";

export const [selectedService, setSelectedService] = createSignal<number>();
export const [hlpMatrix, setHlpMatrix] = createSignal();

export function ServiceTemplate(): JSXElement {
  onMount(async () => {
    // TODO: Afficher spinning wheel !
    const { latLngs, tripIds } = BusServiceUtils.getStartAndEndTripLatLongs();
    const durations = await OsrmService.getHlpMatrix(latLngs);
    console.log("durations", durations);

    // Utiliser tripIds pour setHlpMatrix
  });
  return (
    <div id="service-template">
      <ServiceLeftBoard />
      <Services />
    </div>
  );
}
