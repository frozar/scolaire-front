import { createSignal, onMount } from "solid-js";
import { LineType } from "../../../../_entities/line.entity";
import { TripType } from "../../../../_entities/trip.entity";
import { LineStore } from "../../../../_stores/line.store";
import { ViewManager } from "../../ViewManager";
import { TripAddOrUpdate } from "./TripAddOrUpdate";

export const [selectedEditTrip, setSelectedEditTrip] = createSignal<TripType>();

enum EditTripStep {
  schoolSelection,
  gradeSelection,
  editTrip,
  buildReverse,
}
const [currentStep, setCurrentStep] = createSignal<EditTripStep>(
  EditTripStep.schoolSelection
);

export function TripEdit() {
  const localTrip: TripType = selectedEditTrip() as TripType;
  onMount(() => {
    setCurrentStep(EditTripStep.schoolSelection);
  });

  function previous() {
    ViewManager.tripDetails(selectedEditTrip() as TripType);
  }
  function next() {}

  return (
    <div class="add-line-information-board-content">
      <TripAddOrUpdate
        trip={selectedEditTrip() as TripType}
        line={LineStore.getFromTrip(selectedEditTrip() as TripType) as LineType}
        previous={previous}
        next={next}
      />
    </div>
  );
}
