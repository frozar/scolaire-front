import L from "leaflet";
import { Show, createSignal } from "solid-js";
import {
  defaultLineUnderConstruction,
  useStateAction,
} from "../../../../../StateAction";
import { OsrmService } from "../../../../../_services/osrm.service";
import TimelineAddMode from "../../informationBoard/TimelineAddMode";
import { quitModeAddLine } from "../../shortcut";
import { DrawHelperButton } from "../atom/DrawHelperButton";
import SelectedSchool from "../atom/SelectedSchool";
import "./AddLineInformationBoardContent.css";
import AddLineInformationBoardContentFooter from "./AddLineInformationBoardContentFooter";

const [, { getLineUnderConstruction, setLineUnderConstruction }] =
  useStateAction();

export enum drawModeStep {
  start,
  schoolSelection,
  stopSelection,
  polylineEdition,
  validationStep,
}

export const [currentStep, setCurrentStep] = createSignal<drawModeStep>(
  drawModeStep.start
);

function nextStep() {
  switch (currentStep()) {
    case drawModeStep.schoolSelection:
      if (getLineUnderConstruction().busLine.schools.length == 0) {
        return;
      }
      break;
    case drawModeStep.stopSelection:
      addLineUnderConstructionPolylineWithOsrm();
      break;
    case drawModeStep.polylineEdition:
      console.log(getLineUnderConstruction().busLine);
      break;
    case drawModeStep.validationStep:
      console.log("Validation");
      quitModeAddLine();
      break;
    default:
      console.log("Sorry, we are out of range}.");
  }
  setPreviousStep(currentStep());
  setCurrentStep((currentStep() + 1) % 5);
}

function prevStep() {
  switch (currentStep()) {
    case drawModeStep.schoolSelection:
      setLineUnderConstruction(defaultLineUnderConstruction());
      Time;
      quitModeAddLine();
      break;
    case drawModeStep.stopSelection:
      setLineUnderConstruction(defaultLineUnderConstruction());
      break;
    case drawModeStep.polylineEdition:
      getLineUnderConstruction().busLine.setLatLngs([]);
      break;
    case drawModeStep.validationStep:
      console.log("Validation");
      break;
    default:
      console.log("Sorry, we are out of range}.");
  }
  setPreviousStep(currentStep());
  const step = currentStep() - 1;
  setCurrentStep(step > 0 ? step : 0);
}

export const [previousStep, setPreviousStep] = createSignal<drawModeStep>(
  drawModeStep.start
);
async function addLineUnderConstructionPolylineWithOsrm() {
  // TODO Put to BusLineEntity
  const latlngs: L.LatLng[] = await OsrmService.getRoadPolyline(
    getLineUnderConstruction().busLine.points
  );
  getLineUnderConstruction().busLine.setLatLngs(latlngs);
}

export default function () {
  const etablissementSelected = () => {
    return getLineUnderConstruction().busLine.schools;
  };

  return (
    <div class="add-line-information-board-content">
      <div class="add-line-information-board-content-header">
        <SelectedSchool schoolSelected={etablissementSelected()} />

        <Show when={currentStep() === drawModeStep.stopSelection}>
          <DrawHelperButton schools={etablissementSelected()} />
        </Show>
      </div>
      <Show
        when={
          currentStep() != drawModeStep.start &&
          currentStep() != drawModeStep.schoolSelection
        }
      >
        <div class="bus-line-information-board-content">
          <TimelineAddMode
            line={getLineUnderConstruction}
            setLine={setLineUnderConstruction}
          />
        </div>
      </Show>
      <AddLineInformationBoardContentFooter
        nextStep={nextStep}
        previousStep={prevStep}
      />
    </div>
  );
}
