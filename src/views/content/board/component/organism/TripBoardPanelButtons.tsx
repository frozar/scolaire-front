import { PathEntity } from "../../../../../_entities/path.entity";
import { ButtonPanel } from "../../../../../component/atom/ButtonPanel";
import PlusIcon from "../../../../../icons/PlusIcon";
import { displayAddTripMessage } from "../../../../../userInformation/utils";
import { getBus } from "../../../bus/organism/Bus";
import {
  setThereIsAnError,
  setnoBusError,
} from "../../../map/component/organism/MapErrorPanel";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import { deselectAllTrips } from "../../../map/component/organism/Trips";
import {
  DrawPathStep,
  setCurrentDrawPath,
  setOnDrawPathStep,
} from "../../../path/component/drawPath.utils";
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
    setOnDrawPathStep(DrawPathStep.schoolSelection);
    setCurrentDrawPath(PathEntity.defaultPath());
    changeBoard("path-draw");
  }

  function checkIfCreationIsPossible() {
    if (getBus().length <= 0) {
      setThereIsAnError(true);
      setnoBusError(true);
      return true;
    }
    return false;
  }

  return (
    <div class="flex gap-4">
      <div class="flex gap-2">
        <ButtonPanel
          text="courses"
          onClick={() => setOnTripBoardPanel(TripBoardPanels.trips)}
          active={onTripBoardPanel() == TripBoardPanels.trips}
        />
        <ButtonIcon
          icon={<PlusIcon />}
          onClick={addTrip}
          disable={checkIfCreationIsPossible()}
        />
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
