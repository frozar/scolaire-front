import { FaSolidPen } from "solid-icons/fa";
import { useStateAction } from "../../../../../StateAction";
import { BusLineType } from "../../../../../_entities/bus-line.entity";
import { deselectAllBusLines } from "../../../graphicage/component/organism/BusLines";
import {
  drawModeStep,
  setCurrentStep,
} from "../../../graphicage/component/organism/DrawModeBoardContent";
import { deselectAllPoints } from "../../../graphicage/component/organism/Points";
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
