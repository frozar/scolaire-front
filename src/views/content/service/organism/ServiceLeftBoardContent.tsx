// import {
//   DragDropProvider,
//   DragDropSensors,
//   DragOverlay,
//   SortableProvider,
//   closestCenter,
//   createSortable,
// } from "@thisbeyond/solid-dnd";

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
export type DraggableTripsType = {
  tripName: string;
  lineName: string;
  duration: number;
  hlp: number;
};
export const ServiceLeftBoardContent = () => {
  const [tripsWithoutService, setTripsWithoutService] = createSignal<
    DraggableTripsType[]
  >([]);

  setTripsWithoutService(() => {
    return getLines().flatMap((line) =>
      line.trips.map((trip) => {
        return {
          tripName: trip.name,
          lineName: line.name,
          duration: trip.metrics?.duration,
          hlp: 10,
        } as DraggableTripsType;
      })
    );
  });

  createEffect(() =>
    console.log("tripsWithoutService()", tripsWithoutService())
  );

  return (
    // TODO: Add filter component
    <div id="trips-card-list">
      <For each={tripsWithoutService()}>
        {(tripWithoutService) => <ServiceTripCard trip={tripWithoutService} />}
      </For>
    </div>
  );
};

// export function ServiceLeftBoardContent(): JSXElement {
//   return <div>A</div>;
// }
