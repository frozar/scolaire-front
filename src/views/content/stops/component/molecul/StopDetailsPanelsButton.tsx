import { Accessor, Setter } from "solid-js";
import { ButtonPanel } from "../../../../../component/atom/ButtonPanel";
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
      <ButtonPanel
        text={"écoles:" + props.NbSchool}
        onClick={() => props.setOnPanel(StopPanels.grades)}
        active={props.onPanel() == StopPanels.grades}
      />

      <ButtonPanel
        text={"Courses:" + props.NbTrips}
        onClick={() => props.setOnPanel(StopPanels.trips)}
        active={props.onPanel() == StopPanels.trips}
      />
    </div>
  );
}
