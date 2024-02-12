import { For, JSXElement, Show } from "solid-js";
import { services } from "./Services";

import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { ServiceGridItem } from "../molecule/ServiceGridItem";
import { selectedService } from "../template/ServiceTemplate";
import { zoom } from "./ServiceGrid";
import "./ServiceGridLine.css";

interface ServiceGridLineProps {
  i: number;
  width: string;
}

// TODO: Fix and clean
export function ServiceGridLine(props: ServiceGridLineProps): JSXElement {
  function firstDivWidth(): string {
    return (
      ServiceGridUtils.getEarliestStart(
        services()[props.i].serviceTrips[0].tripId
      ) *
        zoom() +
      "px"
    );
  }

  return (
    <div
      class={"service-grid-line"}
      style={{ width: props.width }}
      classList={{ active: selectedService() == services()[props.i].id }}
    >
      <Show when={services()[props.i].serviceTrips.length != 0}>
        <div
          // TODO: TODO: Hide the div ("opacity-0")
          class="border border-dashed border-black"
          style={{ width: firstDivWidth() }}
        >
          blank space
        </div>
      </Show>

      <For each={services()[props.i].serviceTrips}>
        {(serviceTrip, i) => (
          <ServiceGridItem
            serviceId={services()[props.i].id}
            serviceTrip={serviceTrip}
            i={i()}
          />
        )}
      </For>
    </div>
  );
}
