import {
  //   DragDropProvider,
  //   DragDropSensors,
  //   DragOverlay,
  //   closestCenter,
  //   createSortable,
  SortableProvider,
} from "@thisbeyond/solid-dnd";

import { For, createEffect, createSignal } from "solid-js";
import { getLines } from "../../map/component/organism/BusLines";

import { ServiceTripCard } from "../molecule/ServiceTripCard";
import "./ServiceLeftBoardContent.css";

// const Sortable = (props: { item: number }) => {
//   const sortable = createSortable(props.item);
//   return (
//     <div
//       use:sortable
//       class="sortable"
//       classList={{ "opacity-25": sortable.isActiveDraggable }}
//     >
//       {props.item}
//     </div>
//   );
// };
export type DraggableTripType = {
  tripId: number;
  tripName: string;
  lineName: string;
  duration: number;
  hlp: number;
};
export const [tripsWithoutService, setTripsWithoutService] = createSignal<
  DraggableTripType[]
>([]);

export const ServiceLeftBoardContent = () => {
  setTripsWithoutService(() => {
    return getLines().flatMap((line) =>
      line.trips.map((trip) => {
        return {
          tripId: trip.id,
          tripName: trip.name,
          lineName: line.name,
          duration: trip.metrics?.duration,
          hlp: 10,
        } as DraggableTripType;
      })
    );
  });

  createEffect(() =>
    console.log("tripsWithoutService()", tripsWithoutService())
  );

  function ids(): number[] {
    return tripsWithoutService().map(
      (tripWithoutService) => tripWithoutService.tripId
    );
  }

  return (
    // TODO: Add filter component
    <div id="trips-card-list">
      <SortableProvider ids={ids()}>
        <For each={tripsWithoutService()}>
          {(tripWithoutService) => (
            <ServiceTripCard trip={tripWithoutService} />
          )}
        </For>
      </SortableProvider>
    </div>
  );
};

// export function ServiceLeftBoardContent(): JSXElement {
//   return <div>A</div>;
// }
