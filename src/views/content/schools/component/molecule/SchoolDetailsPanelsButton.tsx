import { Accessor, Setter } from "solid-js";
import { PanelsEnum } from "../organism/SchoolDetailsPanels";
import "./SchoolDetailsPanelsButton.css";

interface PanelsButtonProps {
  setOnPanel: Setter<PanelsEnum>;
  onPanel: Accessor<PanelsEnum>;
  NbTrips?: number;
}

export default function (props: PanelsButtonProps) {
  return (
    <div class="school-details-panels-buttons">
      <button
        class="panel-button"
        classList={{ active: props.onPanel() == PanelsEnum.grades }}
        onClick={() => props.setOnPanel(PanelsEnum.grades)}
      >
        classes
      </button>

      <button
        class="panel-button"
        classList={{ active: props.onPanel() == PanelsEnum.lines }}
        onClick={() => props.setOnPanel(PanelsEnum.lines)}
      >
        Courses: {props.NbTrips ?? "Todo"}
      </button>
    </div>
  );
}
