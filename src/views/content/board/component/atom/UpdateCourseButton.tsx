import { useStateAction } from "../../../../../StateAction";
import { BusCourseType } from "../../../../../_entities/bus-course.entity";

import { createSignal } from "solid-js";
import UpdateButton from "../../../../../icons/UpdatePen";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { drawModeStep, setCurrentStep } from "../organism/DrawModeBoardContent";
import { changeBoard, toggleDrawMod } from "../template/ContextManager";
import "./DrawUpdateButton.css";

const [, { setCourseUnderConstruction, setModeAddCourse }] = useStateAction();

export const [unmodifiedBusCourse, setUnmodifiedBusCourse] =
  createSignal<BusCourseType>();

export default function (props: { busCourse: BusCourseType }) {
  async function onclick() {
    setCourseUnderConstruction({
      busCourse: props.busCourse,
      nextIndex: props.busCourse.points.length ?? 0,
    });
    const [color, setColor] = createSignal<string>(props.busCourse.color());
    setUnmodifiedBusCourse({ ...props.busCourse, color, setColor });

    MapElementUtils.deselectAllPointsAndBusCourses();
    toggleDrawMod();
    setCurrentStep(drawModeStep.editCourse);
    changeBoard("line-draw");
    setModeAddCourse();
  }

  return (
    <div class="graphicage-draw-update-button">
      <button onClick={onclick}>
        <UpdateButton />
      </button>
    </div>
  );
}
