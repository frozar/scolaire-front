import { For, JSXElement, Show } from "solid-js";
import { services } from "./Services";

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
      <Show
        when={services()[props.serviceIndex].serviceTripsOrdered.length != 0}
      >
        <ServiceGridLineFirstDiv
          width={ServiceGridUtils.firstDivWidth(props.serviceIndex)}
        />
      </Show>

      <For each={services()[props.serviceIndex].serviceTripsOrdered}>
        {(serviceTrip, i) => {
          return (
            <ServiceGridItem
              serviceId={services()[props.serviceIndex].id}
              serviceTrip={serviceTrip}
              serviceTripIndex={i()}
              // TODO: Setup a specific componenent to display the waiting time
              hlpWidth={serviceTrip.hlp + serviceTrip.waitingTime}
            />
          );
        }}
      </For>
    </div>
  );
}
