import { useStateAction } from "../../../../../StateAction";

import { RaceType } from "../../../../../_entities/trip.entity";
import UpdateButton from "../../../../../icons/UpdatePen";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import {
  DrawRaceStep,
  setCurrentDrawRace,
  setCurrentRaceIndex,
  setCurrentStep,
  setIsInUpdate,
} from "../organism/DrawRaceBoard";
import { changeBoard, toggleDrawMod } from "../template/ContextManager";
import "./DrawUpdateButton.css";

const [, { setModeDrawRace }] = useStateAction();

export function UpdateRaceButton(props: { trip: RaceType }) {
  async function onclick() {
    setIsInUpdate(true);
    setCurrentDrawRace({ ...props.trip, points: [...props.trip.points] });
    changeBoard("trip-draw");
    setCurrentRaceIndex(props.trip.points.length);

    MapElementUtils.deselectAllPointsAndBusRaces();
    toggleDrawMod();
    setCurrentStep(DrawRaceStep.editRace);
    setModeDrawRace();
  }

  return (
    <div class="graphicage-draw-update-button">
      <button onClick={onclick}>
        <UpdateButton />
      </button>
    </div>
  );
}
