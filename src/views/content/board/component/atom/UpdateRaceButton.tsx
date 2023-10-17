import { useStateAction } from "../../../../../StateAction";

import { RaceType } from "../../../../../_entities/race.entity";
import UpdateButton from "../../../../../icons/UpdatePen";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import {
  DrawRaceStep,
  setCurrentRace,
  setCurrentRaceIndex,
  setCurrentStep,
  setIsInUpdate,
} from "../organism/DrawRaceBoard";
import { changeBoard, toggleDrawMod } from "../template/ContextManager";
import "./DrawUpdateButton.css";

const [, { setModeDrawRace }] = useStateAction();

export function UpdateRaceButton(props: { race: RaceType }) {
  async function onclick() {
    console.log("this update button is used");
    setIsInUpdate(true);
    setCurrentRace(props.race);
    changeBoard("race-draw");
    setCurrentRaceIndex(props.race.points.length);

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
