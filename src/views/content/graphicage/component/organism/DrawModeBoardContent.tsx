import { Show, createSignal } from "solid-js";
import {
  defaultLineUnderConstruction,
  useStateAction,
} from "../../../../../StateAction";

import SelectedSchool from "../atom/SelectedSchool";

import {
  BusLineType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-line.entity";
import { BusLineService } from "../../../../../_services/bus-line.service";

import { quitModeAddLine } from "../../shortcut";
import "./AddLineInformationBoardContent.css";
import { updateBusLines } from "./BusLines";
import DrawModeBoardContentFooter from "./DrawModeBoardContentFooter";

import "../../../../../css/timeline.css";
import Timeline from "../../informationBoard/Timeline";

const [, { getLineUnderConstruction, setLineUnderConstruction }] =
  useStateAction();

export enum drawModeStep {
  start,
  schoolSelection,
  editLine,
}

export const [currentStep, setCurrentStep] = createSignal<drawModeStep>(
  drawModeStep.start
);

export enum displayLineModeEnum {
  straight = "straight",
  onRoad = "onRoad",
}

export const [displayLineMode, setDisplayLineMode] =
  createSignal<displayLineModeEnum>(displayLineModeEnum.straight);

export default function () {
  const etablissementSelected = () => {
    return getLineUnderConstruction().busLine.schools;
  };

  return (
    <div class="add-line-information-board-content">
      <Show when={currentStep() == drawModeStep.schoolSelection}>
        <SelectedSchool schoolSelected={etablissementSelected()} />
      </Show>

      <Show when={currentStep() == drawModeStep.editLine}>
        <div class="bus-line-information-board-content">
          {/* <TimelineAddMode
            line={getLineUnderConstruction}
            setLine={setLineUnderConstruction}
          /> */}
          <Timeline />
        </div>
      </Show>

      <DrawModeBoardContentFooter
        nextStep={{
          callback: nextStep,
          label: currentStep() == drawModeStep.editLine ? "Valider" : "Suivant",
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
  if (busLine.id == undefined) {
    await createBusLine(busLine);
  } else {
    await updateBusLine(busLine);
  }
  quitModeAddLine();
}

async function createBusLine(busLine: BusLineType) {
  const newBusLine: BusLineType = await BusLineService.create(busLine);
  updateBusLines(newBusLine);
}

async function updateBusLine(busLine: BusLineType) {
  const updatedBusLine: BusLineType = await BusLineService.update(busLine);
  updateBusLines(updatedBusLine);
}

async function nextStep() {
  switch (currentStep()) {
    case drawModeStep.schoolSelection:
      if (getLineUnderConstruction().busLine.schools.length < 1) {
        break;
      }
      setCurrentStep(drawModeStep.editLine);
    case drawModeStep.editLine:
      if (getLineUnderConstruction().busLine.points.length < 2) {
        break;
      }
      if (displayLineMode() == displayLineModeEnum.straight) {
        await updatePolylineWithOsrm(getLineUnderConstruction().busLine);
      }

      createOrUpdateBusLine(getLineUnderConstruction().busLine);
  }
}

function prevStep() {
  switch (currentStep()) {
    case drawModeStep.schoolSelection:
      setLineUnderConstruction(defaultLineUnderConstruction());
      quitModeAddLine();

      setCurrentStep(drawModeStep.start);
      break;
    case drawModeStep.editLine:
      setLineUnderConstruction(defaultLineUnderConstruction());

      if (displayLineMode() == displayLineModeEnum.onRoad) {
        getLineUnderConstruction().busLine.setLatLngs([]);
      }

      setCurrentStep(drawModeStep.schoolSelection);
      break;
  }
  setDisplayLineMode((prev) =>
    prev == displayLineModeEnum.straight ? prev : displayLineModeEnum.straight
  );
}
