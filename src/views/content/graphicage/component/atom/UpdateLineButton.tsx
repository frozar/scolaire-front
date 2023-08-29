import { useStateAction } from "../../../../../StateAction";

import { FaSolidPen } from "solid-icons/fa";
import { BusLineType } from "../../../../../_entities/bus-line.entity";
import { deselectAllBusLines } from "../organism/BusLines";
import {
  displayLineModeEnum,
  drawModeStep,
  setCurrentStep,
  setDisplayLineMode,
} from "../organism/DrawModeBoardContent";
import { deselectAllPoints } from "../organism/Points";
import "./DrawHelperButton.css";

// interface DrawHelperButtonProps {
//   schools: SchoolType[] | undefined;
// }

const [, { setLineUnderConstruction, setModeAddLine }] = useStateAction();

export default function (props: { busLine: BusLineType }) {
  async function onclick() {
    setLineUnderConstruction({
      busLine: props.busLine,
      nextIndex: props.busLine.points.length ?? 0,
    });

    deselectAllPoints();
    deselectAllBusLines();
    setDisplayLineMode(displayLineModeEnum.straight);
    setCurrentStep(drawModeStep.editLine);
    setModeAddLine();
  }

  return (
    <div class="graphicage-draw-helper-button">
      <button onClick={onclick}>
        <FaSolidPen />
      </button>
    </div>
  );
}
