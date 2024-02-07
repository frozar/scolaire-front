import { For, JSXElement, Show } from "solid-js";
import { services } from "./Services";

import { TripUtils } from "../../../../utils/trip.utils";
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
    const firstTrip = TripUtils.get(services()[props.i].serviceTrips[0].tripId);

    // TODO: Take which day it is into account
    // TODO: Take Going / Coming information into account
    // TODO: Fix grade default hours and update this
    const earliestArrival =
      (firstTrip.schools[0].hours.startHourComing?.hour as number) * 60 +
      (firstTrip.schools[0].hours.startHourComing?.minutes as number);

    const tripDuration = Math.round(
      (firstTrip.metrics?.duration as number) / 60
    );
    return (earliestArrival - tripDuration) * zoom() + "px";
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
          <ServiceGridItem serviceTrip={serviceTrip} i={i()} />
        )}
      </For>
    </div>
  );
}
