import { Show, createSignal } from "solid-js";
import {
  defaultLineUnderConstruction,
  useStateAction,
} from "../../../../../StateAction";

import TimelineAddMode from "../../informationBoard/TimelineAddMode";
import SelectedSchool from "../atom/SelectedSchool";

import { BusLineType } from "../../../../../_entities/bus-line.entity";
import { BusLineService } from "../../../../../_services/bus-line.service";
import "../../../../../css/timeline.css";
import { quitModeAddLine } from "../../shortcut";
import { updateBusLines } from "./BusLines";
import DrawModeBoardContentFooter from "./DrawModeBoardContentFooter";

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

export default function () {
  // console.log("DrawModeBoardContent");
  // createEffect(() => {
  //   console.log("currentStep()", currentStep());
  // });

  //  ! set var line soit default soit avec la LineToUpdate
  const etablissementSelected = () => {
    return getLineUnderConstruction().busLine.schools;
  };
  // console.log(
  //   "getLineUnderConstruction().busLine.schools",
  //   getLineUnderConstruction().busLine.schools
  // );

  return (
    <div class="add-line-information-board-content">
      {/*  // !when line.shools.lenght > 0 */}
      <Show when={currentStep() == drawModeStep.schoolSelection}>
        {() => console.log("SCHOOL SELECTION")}
        <SelectedSchool schoolSelected={etablissementSelected()} />
      </Show>
      <Show when={currentStep() > drawModeStep.schoolSelection}>
        {() => console.log("AFTER SCHOOL SELECTION")}
        <div class="bus-line-information-board-content">
          <TimelineAddMode
            line={getLineUnderConstruction}
            setLine={setLineUnderConstruction}
          />
        </div>
      </Show>

      {/* <AddLineInformationBoardContentFooter
        nextStep={{
          callback: nextStep,
          label:
            currentStep() > drawModeStep.schoolSelection
              ? "Valider"
              : "Suivant",
        }}
        previousStep={{
          callback: prevStep,
          label:
            currentStep() === drawModeStep.schoolSelection
              ? "Annuler"
              : "Précédant",
        }}
      /> */}
      <DrawModeBoardContentFooter
        nextStep={{
          callback: nextStep,
          label:
            currentStep() > drawModeStep.schoolSelection
              ? "Valider"
              : "Suivant",
        }}
        previousStep={{
          callback: prevStep,
          label:
            currentStep() === drawModeStep.schoolSelection
              ? "Annuler"
              : "Précédant",
        }}
      />
    </div>
  );
}

async function createOrUpdateBusLine(busLine: BusLineType) {
  console.log("Validation finale");
  if (busLine.id == undefined) {
    await createBusLine(busLine);
  } else {
    await updateBusLine(busLine);
  }
  quitModeAddLine();
}

async function createBusLine(busLine: BusLineType) {
  console.log("Create new busLine");
  const newBusLine: BusLineType = await BusLineService.create(busLine);
  updateBusLines(newBusLine);
}

async function updateBusLine(busLine: BusLineType) {
  // TODO to do
  console.log("Update busLine");
  const updatedBusLine: BusLineType = await BusLineService.update(busLine);
  updateBusLines(updatedBusLine);
}

function nextStep() {
  if (currentStep() > drawModeStep.schoolSelection) {
    createOrUpdateBusLine(getLineUnderConstruction().busLine);
  }
  setCurrentStep((currentStep() + 1) % 5);
}

function prevStep() {
  switch (currentStep()) {
    case drawModeStep.schoolSelection:
      setLineUnderConstruction(defaultLineUnderConstruction());
      quitModeAddLine();
      break;
    case drawModeStep.stopSelection:
      setLineUnderConstruction(defaultLineUnderConstruction());
      break;
    case drawModeStep.polylineEdition:
      getLineUnderConstruction().busLine.setLatLngs([]);
      break;
    case drawModeStep.validationStep:
      break;
    default:
      console.log("Sorry, we are out of range}.");
  }
  const step = currentStep() - 1;
  setCurrentStep(step > 0 ? step : 0);
}
