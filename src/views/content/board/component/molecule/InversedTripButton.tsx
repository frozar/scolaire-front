import { Show } from "solid-js";
import { TripType } from "../../../../../_entities/trip.entity";
import Button from "../../../../../component/atom/Button";
import { PathUtil } from "../../../../../utils/path.utils";
import { TripUtils } from "../../../../../utils/trip.utils";
import {
  DrawTripStep,
  setCurrentDrawTrip,
  setCurrentStep,
} from "../organism/DrawTripBoard";
import { changeBoard, toggleDrawMod } from "../template/ContextManager";

interface InversedTripButton {
  trip: TripType;
}

export function InversedTripButton(props: InversedTripButton) {
  function onClick() {
    const inversedTrip = TripUtils.buildReversedTrip(props.trip);
    setCurrentDrawTrip(inversedTrip);
    setCurrentStep(DrawTripStep.buildReverse);
    toggleDrawMod();
    changeBoard("trip-draw");
  }

  return (
    <Show when={!PathUtil.haveReversedTrip(props.trip)}>
      <Button
        label="Construire la course inverse"
        onClick={onClick}
        size="sm"
      />
    </Show>
  );
}
