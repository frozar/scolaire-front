import { Accessor, Setter } from "solid-js";
import { Panels } from "../organism/SchoolDetails";
import "./SchoolDetailsPanelsButton.css";

interface PanelsButtonProps {
  setOnPanel: Setter<Panels>;
  onPanel: Accessor<Panels>;
  NbCourses?: number;
}

export default function (props: PanelsButtonProps) {
  return (
    <div class="school-details-panels-buttons">
      <button
        class="panel-button"
        classList={{ active: props.onPanel() == Panels.classes }}
        onClick={() => props.setOnPanel(Panels.classes)}
      >
        classes
      </button>

      <button
        class="panel-button"
        classList={{ active: props.onPanel() == Panels.lines }}
        onClick={() => props.setOnPanel(Panels.lines)}
      >
        Courses: {props.NbCourses ?? "Todo"}
      </button>
    </div>
  );
}
