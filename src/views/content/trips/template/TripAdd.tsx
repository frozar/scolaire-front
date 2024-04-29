import { createSignal } from "solid-js";
import { LineType } from "../../../../_entities/line.entity";
import { TripEntity, TripType } from "../../../../_entities/trip.entity";
import { TripService } from "../../../../_services/trip.service";
import { LineStore } from "../../../../_stores/line.store";
import { addNewGlobalSuccessInformation } from "../../../../signaux";
import { ViewManager } from "../../ViewManager";
import { TripAddOrUpdate } from "./TripAddOrUpdate";

export const [selectedTripAddLine, setSelectedTripAddLine] =
  createSignal<LineType>({} as LineType);

export function TripAdd() {
  function previous() {
    ViewManager.lines();
  }
  async function next(trip: TripType) {
    const newTrip = await TripService.create(trip);
    LineStore.addTrip(newTrip);
    ViewManager.tripDetails(newTrip);
    addNewGlobalSuccessInformation(newTrip.name + " a été créé");
  }

  return (
    <>
      <TripAddOrUpdate
        next={next}
        previous={previous}
        trip={TripEntity.defaultTrip(selectedTripAddLine()?.id)}
        line={selectedTripAddLine()}
      />
    </>
  );
}
