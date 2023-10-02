import { useStateAction } from "../../../../../StateAction";
import { CourseType } from "../../../../../_entities/course.entity";

import { createSignal } from "solid-js";
import UpdateButton from "../../../../../icons/UpdatePen";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { drawModeStep, setCurrentStep } from "../organism/DrawModeBoardContent";
import { changeBoard, toggleDrawMod } from "../template/ContextManager";
import "./DrawUpdateButton.css";

const [, { setLineUnderConstruction, setModeAddLine }] = useStateAction();

export const [unmodifiedCourse, setUnmodifiedCourse] =
  createSignal<CourseType>();

export default function (props: { busLine: CourseType }) {
  async function onclick() {
    setLineUnderConstruction({
      busLine: props.busLine,
      nextIndex: props.busLine.points.length ?? 0,
    });
    const [color, setColor] = createSignal<string>(props.busLine.color());
    setUnmodifiedCourse({ ...props.busLine, color, setColor });

    MapElementUtils.deselectAllPointsAndCourses();
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
