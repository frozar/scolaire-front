import {
  SortableProvider,
  createDroppable,
  createSortable,
} from "@thisbeyond/solid-dnd";
import { For, JSXElement } from "solid-js";
import { TripUtils } from "../../../../utils/trip.utils";
import { getLines } from "../../map/component/organism/BusLines";
import { ServiceType } from "./Services";

interface ServiceGridLineProps {
  service: ServiceType;
}

export function ServiceGridLine(props: ServiceGridLineProps): JSXElement {
  const droppable = createDroppable(props.service.id);
  //   function tripIds(): number[] {
  //     return props.service.tripsIds;
  //   }

  console.log(
    "test",
    getLines()
      .flatMap((line) => line.trips)
      .map((trip) => trip.id)
  );
  return (
    // <div use:droppable class={"column bg-red-400 w-40 border "}>
    <div use:droppable class={"h-20 w-[1000px] bg-red-500 border border-y-0"}>
      <SortableProvider ids={props.service.tripsIds}>
        <For each={props.service.tripsIds}>
          {(tripId) => <Sortable id={tripId} />}
        </For>
      </SortableProvider>
    </div>
  );
}
// TODO: Move in another file
function Sortable(props: { id: number }) {
  const sortable = createSortable(props.id);
  return (
    <div
      use:sortable
      class="sortable border border-blue-500 w-24 h-24"
      // classList={{ "opacity-25": sortable.isActiveDraggable }}
    >
      {TripUtils.get(props.id).name}
    </div>
  );
}
