import { RaceType } from "../../../../../_entities/race.entity";

import { createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import UpdateButton from "../../../../../icons/UpdatePen";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { DrawRaceStep, setCurrentStep } from "../organism/DrawRaceBoard";
import { changeBoard, toggleDrawMod } from "../template/ContextManager";
import "./DrawUpdateButton.css";

const [, { setModeDrawRace }] = useStateAction();

export const [unmodifiedBusRace, setUnmodifiedBusRace] =
  createSignal<RaceType>();

export default function (props: { course: RaceType }) {
  async function onclick() {
    const [color, setColor] = createSignal<string>(props.course.color());
    setUnmodifiedBusRace({ ...props.course, color, setColor });

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
