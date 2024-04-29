import { createSignal } from "solid-js";
import { LineType } from "../../../../_entities/line.entity";
import { TripType } from "../../../../_entities/trip.entity";
import { TripService } from "../../../../_services/trip.service";
import { LineStore } from "../../../../_stores/line.store";
import { ViewManager } from "../../ViewManager";
import { TripAddOrUpdate } from "./TripAddOrUpdate";

export const [selectedEditTrip, setSelectedEditTrip] = createSignal<TripType>();

export function TripEdit() {
  function previous() {
    ViewManager.tripDetails(selectedEditTrip() as TripType);
  }
  async function next(trip: TripType) {
    const newTrip = await TripService.update(trip);
    LineStore.updateTrip(newTrip);
    ViewManager.tripDetails(newTrip);
  }

  return (
    <>
      <TripAddOrUpdate
        trip={selectedEditTrip() as TripType}
        line={LineStore.getFromTrip(selectedEditTrip() as TripType) as LineType}
        previous={previous}
        next={next}
      />
    </>
  );
}
