import { Show, createSignal } from "solid-js";
import {
  defaultLineUnderConstruction,
  useStateAction,
} from "../../../../../StateAction";

import TimelineAddMode from "../../informationBoard/TimelineAddMode";
import SelectedSchool from "../atom/SelectedSchool";

import {
  BusLineType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-line.entity";
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
          <TimelineAddMode
            line={getLineUnderConstruction}
            setLine={setLineUnderConstruction}
          />
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

async function nextStep() {
  if (currentStep() == drawModeStep.schoolSelection) {
    if (getLineUnderConstruction().busLine.schools.length < 1) {
      return;
    }
    setCurrentStep(drawModeStep.editLine);
  } else {
    if (getLineUnderConstruction().busLine.points.length < 2) {
      return;
    }
    if (displayLineMode() == displayLineModeEnum.straight) {
      await updatePolylineWithOsrm(getLineUnderConstruction().busLine);
    }

    createOrUpdateBusLine(getLineUnderConstruction().busLine);
  }
}

function prevStep() {
  if (currentStep() == drawModeStep.schoolSelection) {
    setLineUnderConstruction(defaultLineUnderConstruction());
    quitModeAddLine();

    setCurrentStep(drawModeStep.start);
  } else if (currentStep() == drawModeStep.editLine) {
    setLineUnderConstruction(defaultLineUnderConstruction());

    if (displayLineMode() == displayLineModeEnum.onRoad) {
      getLineUnderConstruction().busLine.setLatLngs([]);
    }

    setCurrentStep(drawModeStep.schoolSelection);
  }
  setDisplayLineMode((prev) =>
    prev == displayLineModeEnum.straight ? prev : displayLineModeEnum.straight
  );
}
