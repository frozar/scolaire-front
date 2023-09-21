import { useStateAction } from "../../../../../StateAction";
import { BusLineType } from "../../../../../_entities/bus-line.entity";
import { deselectAllBusLines } from "../../../map/component/organism/BusLines";

import { createSignal } from "solid-js";
import UpdateButton from "../../../../../icons/UpdateButton";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import { drawModeStep, setCurrentStep } from "../organism/DrawModeBoardContent";
import { changeBoard, toggleDrawMod } from "../template/ContextManager";
import "./DrawUpdateButton.css";

// interface DrawHelperButtonProps {
//   schools: SchoolType[] | undefined;
// }

const [, { setLineUnderConstruction, setModeAddLine }] = useStateAction();

export const [unmodifiedBusLine, setUnmodifiedBusLine] =
  createSignal<BusLineType>();

export default function (props: { busLine: BusLineType }) {
  async function onclick() {
    setLineUnderConstruction({
      busLine: props.busLine,
      nextIndex: props.busLine.points.length ?? 0,
    });
    const [color, setColor] = createSignal<string>(props.busLine.color());
    setUnmodifiedBusLine({ ...props.busLine, color, setColor });

    deselectAllPoints();
    deselectAllBusLines();
    toggleDrawMod();
    setCurrentStep(drawModeStep.editLine);
    changeBoard("line-draw");
    setModeAddLine();
  }

  return (
    <div class="graphicage-draw-update-button">
      <button onClick={onclick}>
        <UpdateButton />
      </button>
    </div>
  );
}
