import { Accessor, Setter } from "solid-js";
import { Panels } from "../organism/StopDetails";
import "./StopDetailsPanelsButton.css";

interface PanelsButtonProps {
  setOnPanel: Setter<Panels>;
  onPanel: Accessor<Panels>;
  NbLines?: number;
  NbSchool: number;
}

export default function (props: PanelsButtonProps) {
  return (
    <div class="stop-details-panels-buttons">
      <button
        class="panel-button"
        classList={{ active: props.onPanel() == Panels.classes }}
        onClick={() => props.setOnPanel(Panels.classes)}
      >
        écoles: {props.NbSchool}
      </button>

      <button
        class="panel-button"
        classList={{ active: props.onPanel() == Panels.lines }}
        onClick={() => props.setOnPanel(Panels.lines)}
      >
        lignes: {props.NbLines ?? "Todo"}
      </button>
    </div>
  );
}
