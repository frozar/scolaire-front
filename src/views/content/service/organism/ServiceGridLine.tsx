import { For, JSXElement } from "solid-js";
import { ServiceTripType, services } from "./Services";

import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { ServiceGridLineFirstDiv } from "../atom/ServiceGridLineFirstDiv";
import { ServiceGridItem } from "../molecule/ServiceGridItem";
import { selectedService } from "../template/ServiceTemplate";
import "./ServiceGridLine.css";

interface ServiceGridLineProps {
  serviceIndex: number;
  width: string;
}

// TODO: Fix and clean
export function ServiceGridLine(props: ServiceGridLineProps): JSXElement {
  return (
    <div
      class={"service-grid-line"}
      style={{ width: props.width }}
      classList={{
        active: selectedService() == services()[props.serviceIndex].id,
      }}
    >
      <ServiceGridLineFirstDiv serviceIndex={props.serviceIndex} />

      <For each={services()[props.serviceIndex].serviceTrips}>
        {(serviceTrip, i) => (
          <ServiceGridItem
            serviceId={services()[props.serviceIndex].id}
            serviceTrip={serviceTrip}
            serviceTripIndex={i()}
            hlpWidth={hlpWidth(serviceTrip, props.serviceIndex, i())}
          />
        )}
      </For>
    </div>
  );
}

function hlpWidth(
  serviceTrip: ServiceTripType,
  serviceIndex: number,
  serviceTripIndex: number
) {
  return ServiceGridUtils.updateAndGetHlpWidth(
    serviceTrip,
    services()[serviceIndex].id,
    serviceTripIndex
  );
}
