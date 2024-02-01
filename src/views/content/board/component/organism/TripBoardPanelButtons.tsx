import { ButtonPanel } from "../../../../../component/atom/ButtonPanel";
import {
  TripBoardPanels,
  onTripBoardPanel,
  setOnTripBoardPanel,
} from "./TripsBoard";

export function TripBoardPanelButtons() {
  return (
    <div class="flex gap-4">
      <ButtonPanel
        text="courses"
        onClick={() => setOnTripBoardPanel(TripBoardPanels.trips)}
        active={onTripBoardPanel() == TripBoardPanels.trips}
      />

      <ButtonPanel
        text="chemins"
        onClick={() => setOnTripBoardPanel(TripBoardPanels.paths)}
        active={onTripBoardPanel() == TripBoardPanels.paths}
      />
    </div>
  );
}
