import { PathEntity } from "../../../../../_entities/path.entity";
import { ButtonPanel } from "../../../../../component/atom/ButtonPanel";
import PlusIcon from "../../../../../icons/PlusIcon";
import { displayAddTripMessage } from "../../../../../userInformation/utils";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import { deselectAllTrips } from "../../../map/component/organism/Trips";
import { setCurrentDrawPath } from "../../../path/component/drawPath.utils";
import ButtonIcon from "../molecule/ButtonIcon";
import {
  changeBoard,
  onBoard,
  toggleDrawMod,
} from "../template/ContextManager";
import { DrawTripStep, setCurrentStep } from "./DrawTripBoard";
import {
  TripBoardPanels,
  onTripBoardPanel,
  setOnTripBoardPanel,
} from "./TripsBoard";

export function TripBoardPanelButtons() {
  function addTrip() {
    if (onBoard() == "trip-draw") {
      toggleDrawMod();
      setCurrentStep(DrawTripStep.initial);
    } else {
      deselectAllPoints();
      deselectAllTrips();
      toggleDrawMod();

      setCurrentStep(DrawTripStep.schoolSelection);
      displayAddTripMessage();
    }
  }

  function addPath() {
    deselectAllPoints();
    deselectAllTrips();
    toggleDrawMod();

    setCurrentDrawPath(PathEntity.defaultPath());
    changeBoard("path-draw");
  }

  return (
    <div class="flex gap-4">
      <div class="flex gap-2">
        <ButtonPanel
          text="courses"
          onClick={() => setOnTripBoardPanel(TripBoardPanels.trips)}
          active={onTripBoardPanel() == TripBoardPanels.trips}
        />
        <ButtonIcon icon={<PlusIcon />} onClick={addTrip} />
      </div>

      <div class="flex gap-2">
        <ButtonPanel
          text="chemins"
          onClick={() => setOnTripBoardPanel(TripBoardPanels.paths)}
          active={onTripBoardPanel() == TripBoardPanels.paths}
        />
        <ButtonIcon icon={<PlusIcon />} onClick={addPath} />
      </div>
    </div>
  );
}
