import { createSignal } from "solid-js";
import { LineType } from "../../../../../_entities/line.entity";
import UpdateButton from "../../../../../icons/UpdatePen";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { DrawTripStep, setCurrentStep } from "../organism/DrawTripBoard";
import { changeBoard, toggleDrawMod } from "../template/ContextManager";
import "./DrawUpdateButton.css";

export const [unmodifiedTrip, setUnmodifiedTrip] = createSignal<LineType>();

export default function (props: { line: LineType }) {
  async function onclick() {
    console.log("course update", props);
    // setLineUnderConstruction({
    //   course: props.course,
    //   nextIndex: props.course.points.length ?? 0,
    // });
    // const [color, setColor] = createSignal<string>(props.course.color());
    // setUnmodifiedTrip({ ...props.course, color, setColor });

    MapElementUtils.deselectAllPointsAndTrips();
    toggleDrawMod();
    setCurrentStep(DrawTripStep.editLine);
    changeBoard("trip-draw");
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
