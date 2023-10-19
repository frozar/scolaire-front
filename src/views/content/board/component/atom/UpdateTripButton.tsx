import { useStateAction } from "../../../../../StateAction";

import { TripType } from "../../../../../_entities/trip.entity";
import UpdateButton from "../../../../../icons/UpdatePen";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import {
  DrawTripStep,
  setCurrentDrawTrip,
  setCurrentStep,
  setCurrentTripIndex,
  setIsInUpdate,
} from "../organism/DrawTripBoard";
import { changeBoard, toggleDrawMod } from "../template/ContextManager";
import "./DrawUpdateButton.css";

const [, { setModeDrawTrip }] = useStateAction();

export function UpdateTripButton(props: { trip: TripType }) {
  async function onclick() {
    setIsInUpdate(true);
    setCurrentDrawTrip({ ...props.trip, points: [...props.trip.points] });
    changeBoard("trip-draw");
    setCurrentTripIndex(props.trip.points.length);

    MapElementUtils.deselectAllPointsAndBusTrips();
    toggleDrawMod();
    setCurrentStep(DrawTripStep.editTrip);
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
