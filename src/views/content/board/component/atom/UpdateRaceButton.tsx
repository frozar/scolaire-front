import { useStateAction } from "../../../../../StateAction";

import { RaceType } from "../../../../../_entities/race.entity";
import UpdateButton from "../../../../../icons/UpdatePen";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import {
  DrawRaceStep,
  setCurrentRace,
  setCurrentStep,
  setIsInUpdate,
} from "../organism/DrawRaceBoard";
import { changeBoard, toggleDrawMod } from "../template/ContextManager";
import "./DrawUpdateButton.css";

const [, { setModeDrawRace }] = useStateAction();

export function UpdateRaceButton(props: { race: RaceType }) {
  async function onclick() {
    setCurrentRace(props.race);
    setIsInUpdate(true);

    MapElementUtils.deselectAllPointsAndBusRaces();
    toggleDrawMod();
    setCurrentStep(DrawRaceStep.editRace);
    changeBoard("race-draw");
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
