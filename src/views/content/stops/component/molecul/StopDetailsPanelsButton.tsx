import { Accessor, Setter } from "solid-js";
import { StopPanels } from "../organism/StopDetails";
import "./StopDetailsPanelsButton.css";

interface PanelsButtonProps {
  setOnPanel: Setter<StopPanels>;
  onPanel: Accessor<StopPanels>;
  NbRaces?: number;
  NbSchool: number;
}

export default function (props: PanelsButtonProps) {
  return (
    <div class="stop-details-panels-buttons">
      <button
        class="panel-button"
        classList={{ active: props.onPanel() == StopPanels.classes }}
        onClick={() => props.setOnPanel(StopPanels.classes)}
      >
        écoles: {props.NbSchool}
      </button>

      <button
        class="panel-button"
        classList={{ active: props.onPanel() == StopPanels.races }}
        onClick={() => props.setOnPanel(StopPanels.races)}
      >
        Races: {props.NbRaces}
      </button>
    </div>
  );
}
