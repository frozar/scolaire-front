import { For, JSXElement } from "solid-js";
import { TripUtils } from "../../../../utils/trip.utils";
import { ServiceType } from "./Services";

interface ServiceGridLineProps {
  service: ServiceType;
}

export function ServiceGridLine(props: ServiceGridLineProps): JSXElement {
  return (
    <div class={"h-20 w-[1000px] bg-red-500 border border-y-0"}>
      <For each={props.service.tripsIds}>
        {(tripId) => <Sortable id={tripId} />}
      </For>
    </div>
  );
}
// TODO: Move in another file
function Sortable(props: { id: number }) {
  return (
    <div class="sortable border border-blue-500 w-24 h-24">
      {TripUtils.get(props.id).name}
    </div>
  );
}
