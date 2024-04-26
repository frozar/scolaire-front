import { For } from "solid-js";
import { CalendarDayEnum } from "../../../../_entities/calendar.entity";
import { FlatGraphicStore } from "../../../../_stores/flatGraphics.store";
import { getLines } from "../../../../_stores/line.store";
import { ServiceStore } from "../../../../_stores/service.store";
import { ServiceTripCard } from "../molecule/ServiceTripCard";
import { currentGraphic } from "./FlatGraphics";
import "./ServiceLeftBoardContent.css";

export type DraggableTripType = {
  tripId: number;
  tripName: string;
  lineName: string;
  duration: number;
  hlp: number;
  days: CalendarDayEnum[];
};

// TODO: Use arg to specify filter !
// function tripsWithoutService(): DraggableTripType[] {
//   const alreadyAssignedTripIds = services()
//     .flatMap((service) => service.serviceTrips)
//     .map((serviceTrip) => serviceTrip.tripId);

//   return getLines()
//     .flatMap((line) =>
//       line.trips.map((trip) => {
//         return {
//           tripId: trip.id,
//           tripName: trip.name,
//           lineName: line.name,
//           duration: trip.metrics?.duration,
//           hlp: 10,
//           days: trip.days,
//         } as DraggableTripType;
//       })
//     )
//     .filter((_trip) => !alreadyAssignedTripIds.includes(_trip.tripId));
// }

function availableTrips() {
  const output: DraggableTripType[] = [];

  const allTrips = getLines().flatMap((line) =>
    line.trips.map((trip) => {
      return {
        tripId: trip.id,
        tripName: trip.name,
        lineName: line.name,
        duration: trip.metrics?.duration,
        hlp: 10,
        days: trip.days,
      } as DraggableTripType;
    })
  );

  const currentFlatGraphic = FlatGraphicStore.get().filter(
    (graphic) => graphic.id == currentGraphic()
  );
  if (currentFlatGraphic.length <= 0) return;

  const currentServices = ServiceStore.get().filter(
    (service) => service.flatGraphicId == currentGraphic()
  );

  const usedTripsId = currentServices
    .flatMap((service) => service.serviceTrips)
    .map((serviceTrip) => serviceTrip.tripId);

  allTrips.forEach((trip) => {
    trip.days.forEach((day) => {
      if (!currentFlatGraphic[0].days.includes(day)) return;
      if (!output.includes(trip) && !usedTripsId.includes(trip.tripId))
        output.push(trip);
    });
  });
  return output;
}

export const ServiceLeftBoardContent = () => {
  return (
    // TODO: Add filter component
    // TODO: Create new component TripCardList
    <div id="trips-card-list">
      <For each={availableTrips()}>
        {(tripWithoutService) => (
          <ServiceTripCard
            draggableTrip={tripWithoutService as DraggableTripType}
          />
        )}
      </For>
    </div>
  );
};
