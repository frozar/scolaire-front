import { FaSolidPen } from "solid-icons/fa";
import { useStateAction } from "../../../../../StateAction";
import {
  BusLinePointType,
  BusLineType,
} from "../../../../../_entities/bus-line.entity";
import { deselectAllBusLines } from "../../../map/component/organism/BusLines";

import { createSignal } from "solid-js";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import { drawModeStep, setCurrentStep } from "../organism/DrawModeBoardContent";
import { changeBoard, toggleDrawMod } from "../template/ContextManager";
import "./DrawHelperButton.css";

// interface DrawHelperButtonProps {
//   schools: SchoolType[] | undefined;
// }

const [, { setLineUnderConstruction, setModeAddLine }] = useStateAction();

export const [currentPoints, setCurrentPoints] = createSignal<
  BusLinePointType[]
>([]);

export default function (props: { busLine: BusLineType }) {
  async function onclick() {
    setLineUnderConstruction({
      busLine: props.busLine,
      nextIndex: props.busLine.points.length ?? 0,
    });
    // TODO: Save the whole busline
    setCurrentPoints(props.busLine.points);

    deselectAllPoints();
    deselectAllBusLines();
    toggleDrawMod();
    setCurrentStep(drawModeStep.editLine);
    changeBoard("draw-line");
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
