import { TripType } from "../../../../../_entities/trip.entity";

import { createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import UpdateButton from "../../../../../icons/UpdatePen";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { DrawTripStep, setCurrentStep } from "../organism/DrawTripBoard";
import { changeBoard, toggleDrawMod } from "../template/ContextManager";
import "./DrawUpdateButton.css";

const [, { setModeDrawTrip }] = useStateAction();

export const [unmodifiedBusTrip, setUnmodifiedBusTrip] =
  createSignal<TripType>();

export default function (props: { trip: TripType }) {
  async function onclick() {
    const [color, setColor] = createSignal<string>(props.trip.color());
    setUnmodifiedBusTrip({ ...props.trip, color, setColor });

    MapElementUtils.deselectAllPointsAndBusTrips();
    toggleDrawMod();
    setCurrentStep(DrawTripStep.editTrip);
    changeBoard("trip-draw");
    setModeDrawTrip();
  }

  return (
    <div class="graphicage-draw-update-button">
      <button onClick={onclick}>
        <UpdateButton />
      </button>
    </div>
  );
}
