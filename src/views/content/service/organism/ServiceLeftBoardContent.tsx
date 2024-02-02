import { For } from "solid-js";
import { getLines } from "../../map/component/organism/BusLines";
import { ServiceTripCard } from "../molecule/ServiceTripCard";
import "./ServiceLeftBoardContent.css";
import { services } from "./Services";

export type DraggableTripType = {
  tripId: number;
  tripName: string;
  lineName: string;
  duration: number;
  hlp: number;
};
// export const [tripsWithoutService, setTripsWithoutService] = createSignal<
//   DraggableTripType[]
// >([]);

// TODO: Use arg to specify filter !
function tripsWithoutService(): DraggableTripType[] {
  // Get id of already assugned trips
  const alreadyAssignedTripIds = services().flatMap(
    (service) => service.tripsIds
  );
  // Get all trips filtered
  return getLines()
    .flatMap((line) =>
      line.trips.map((trip) => {
        return {
          tripId: trip.id,
          tripName: trip.name,
          lineName: line.name,
          duration: trip.metrics?.duration,
          hlp: 10,
        } as DraggableTripType;
      })
    )
    .filter((_trip) => !alreadyAssignedTripIds.includes(_trip.tripId));
}

export const ServiceLeftBoardContent = () => {
  // setTripsWithoutService(() => {
  //   return getLines().flatMap((line) =>
  //     line.trips.map((trip) => {
  //       return {
  //         tripId: trip.id,
  //         tripName: trip.name,
  //         lineName: line.name,
  //         duration: trip.metrics?.duration,
  //         hlp: 10,
  //       } as DraggableTripType;
  //     })
  //   );
  // });

  return (
    // TODO: Add filter component
    // TODO: Create new component TripCardList
    <div id="trips-card-list">
      <For each={tripsWithoutService()}>
        {(tripWithoutService) => <ServiceTripCard trip={tripWithoutService} />}
      </For>
    </div>
  );
};
