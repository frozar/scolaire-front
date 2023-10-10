import { useStateAction } from "../../../../../StateAction";
import { CourseType } from "../../../../../_entities/course.entity";

import { createSignal } from "solid-js";
import UpdateButton from "../../../../../icons/UpdatePen";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { drawModeStep, setCurrentStep } from "../organism/DrawModeBoardContent";
import { changeBoard, toggleDrawMod } from "../template/ContextManager";
import "./DrawUpdateButton.css";

const [, { setCourseUnderConstruction, setModeAddCourse }] = useStateAction();

export const [unmodifiedBusCourse, setUnmodifiedBusCourse] =
  createSignal<CourseType>();

export default function (props: { course: CourseType }) {
  async function onclick() {
    setCourseUnderConstruction({
      course: props.course,
      nextIndex: props.course.points.length ?? 0,
    });
    const [color, setColor] = createSignal<string>(props.course.color());
    setUnmodifiedBusCourse({ ...props.course, color, setColor });

    MapElementUtils.deselectAllPointsAndBusCourses();
    toggleDrawMod();
    setCurrentStep(drawModeStep.editCourse);
    changeBoard("course-draw");
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
