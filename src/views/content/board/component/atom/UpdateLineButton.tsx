import { CourseType } from "../../../../../_entities/course.entity";

import { createSignal } from "solid-js";
import UpdateButton from "../../../../../icons/UpdatePen";
import "./DrawUpdateButton.css";

export const [unmodifiedCourse, setUnmodifiedCourse] =
  createSignal<CourseType>();

export default function (props: { course: CourseType }) {
  async function onclick() {
    console.log("course update", props);
    // setLineUnderConstruction({
    //   course: props.course,
    //   nextIndex: props.course.points.length ?? 0,
    // });
    // const [color, setColor] = createSignal<string>(props.course.color());
    // setUnmodifiedCourse({ ...props.course, color, setColor });

    // MapElementUtils.deselectAllPointsAndBusCourses();
    // toggleDrawMod();
    // setCurrentStep(AddLineStep.editLine);
    // changeBoard("course-draw");
    // setModeAddLine();
  }

  return (
    <div class="graphicage-draw-update-button">
      <button onClick={onclick}>
        <UpdateButton />
      </button>
    </div>
  );
}
