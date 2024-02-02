import { For, JSXElement } from "solid-js";
import { ServiceTrip } from "../molecule/ServiceTrip";
import { ServiceType } from "./Services";

interface ServiceGridLineProps {
  service: ServiceType;
}

export function ServiceGridLine(props: ServiceGridLineProps): JSXElement {
  return (
    <div class={"h-20 w-[1000px] bg-red-500 border border-y-0"}>
      <For each={props.service.tripsIds}>
        {(tripId) => <ServiceTrip id={tripId} />}
      </For>
    </div>
  );
}
