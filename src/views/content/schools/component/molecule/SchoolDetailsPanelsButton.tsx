import { Accessor, Setter } from "solid-js";
import { Panels } from "../organism/SchoolDetails";
import "./SchoolDetailsPanelsButton.css";

interface PanelsButtonProps {
  setOnPanel: Setter<Panels>;
  onPanel: Accessor<Panels>;
  NbTrips?: number;
}

export default function (props: PanelsButtonProps) {
  return (
    <div class="school-details-panels-buttons">
      <button
        class="panel-button"
        classList={{ active: props.onPanel() == Panels.grades }}
        onClick={() => props.setOnPanel(Panels.grades)}
      >
        classes
      </button>

      <button
        class="panel-button"
        classList={{ active: props.onPanel() == Panels.lines }}
        onClick={() => props.setOnPanel(Panels.lines)}
      >
        Courses: {props.NbTrips ?? "Todo"}
      </button>
    </div>
  );
}
