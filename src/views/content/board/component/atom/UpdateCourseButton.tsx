import { CourseType } from "../../../../../_entities/course.entity";

import { createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import UpdateButton from "../../../../../icons/UpdatePen";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { DrawModeStep, setCurrentStep } from "../organism/DrawRaceBoard";
import { changeBoard, toggleDrawMod } from "../template/ContextManager";
import "./DrawUpdateButton.css";

const [, { setModeDrawRace }] = useStateAction();

export const [unmodifiedBusCourse, setUnmodifiedBusCourse] =
  createSignal<CourseType>();

export default function (props: { course: CourseType }) {
  async function onclick() {
    const [color, setColor] = createSignal<string>(props.course.color());
    setUnmodifiedBusCourse({ ...props.course, color, setColor });

    MapElementUtils.deselectAllPointsAndBusCourses();
    toggleDrawMod();
    setCurrentStep(DrawModeStep.editCourse);
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
