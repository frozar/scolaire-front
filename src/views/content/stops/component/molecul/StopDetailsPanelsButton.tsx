import { Accessor, Setter } from "solid-js";
import { StopPanels } from "../organism/StopDetails";
import "./StopDetailsPanelsButton.css";

interface PanelsButtonProps {
  setOnPanel: Setter<StopPanels>;
  onPanel: Accessor<StopPanels>;
  NbTrips?: number;
  NbSchool: number;
}

export default function (props: PanelsButtonProps) {
  return (
    <div class="stop-details-panels-buttons">
      <button
        class="panel-button"
        classList={{ active: props.onPanel() == StopPanels.grades }}
        onClick={() => props.setOnPanel(StopPanels.grades)}
      >
        écoles: {props.NbSchool}
      </button>

      <button
        class="panel-button"
        classList={{ active: props.onPanel() == StopPanels.trips }}
        onClick={() => props.setOnPanel(StopPanels.trips)}
      >
        Trips: {props.NbTrips}
      </button>
    </div>
  );
}
