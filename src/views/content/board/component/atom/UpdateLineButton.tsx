import { createSignal } from "solid-js";
import { LineType } from "../../../../../_entities/line.entity";
import UpdateButton from "../../../../../icons/UpdatePen";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { DrawModeStep, setCurrentStep } from "../organism/DrawModeBoardContent";
import { changeBoard, toggleDrawMod } from "../template/ContextManager";
import "./DrawUpdateButton.css";

export const [unmodifiedCourse, setUnmodifiedCourse] = createSignal<LineType>();

export default function (props: { line: LineType }) {
  async function onclick() {
    console.log("course update", props);
    // setLineUnderConstruction({
    //   course: props.course,
    //   nextIndex: props.course.points.length ?? 0,
    // });
    // const [color, setColor] = createSignal<string>(props.course.color());
    // setUnmodifiedCourse({ ...props.course, color, setColor });

    MapElementUtils.deselectAllPointsAndCourses();
    toggleDrawMod();
    setCurrentStep(DrawModeStep.editLine);
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
