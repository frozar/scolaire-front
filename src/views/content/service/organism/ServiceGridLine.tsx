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
    const firstTrip = TripUtils.get(services()[props.i].tripsIds[0]);
    console.log("firstTrip", firstTrip);
    console.log(
      "firstTrip.schools[0].hours.startHourComing?.hour",
      firstTrip.schools[0].hours.startHourComing?.hour
    );
    console.log(
      "firstTrip.schools[0].hours.startHourComing?.minutes",
      firstTrip.schools[0].hours.startHourComing?.minutes
    );

    // TODO: Take which day it is into account
    // TODO: Take Going / Coming information into account
    // TODO: Fix grade default hours and update this
    const earliestArrival =
      (firstTrip.schools[0].hours.startHourComing?.hour as number) * 60 +
      (firstTrip.schools[0].hours.startHourComing?.minutes as number);

    console.log("earliestArrival", earliestArrival);
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
      <Show when={services()[props.i].tripsIds.length != 0}>
        <div
          // TODO: When not necessary anymore
          class="border border-dashed border-black"
          style={{ width: firstDivWidth() }}
        >
          blank space
        </div>
      </Show>
      <For each={services()[props.i].tripsIds}>
        {(tripId) => <ServiceGridItem tripId={tripId} />}
      </For>
    </div>
  );
}
