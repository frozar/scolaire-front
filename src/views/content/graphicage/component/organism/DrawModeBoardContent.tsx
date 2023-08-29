import { Show, createEffect, createSignal } from "solid-js";
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

// ! replace stopSelection, polylineEdition, validationStep with editLine
export enum drawModeStep {
  start,
  schoolSelection,
  editLine,
  // stopSelection,
  // polylineEdition,
  // validationStep,
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
  console.log("Draw mode board content");
  // setDisplayLineMode(displayLineModeEnum.straight);

  // ! delete
  createEffect(() => {
    console.log("createEffect currentStep()", currentStep());
  });
  createEffect(() => {
    console.log("displayLineMode()====>", displayLineMode());
  });

  //  ! set var line soit default soit avec la LineToUpdate
  const etablissementSelected = () => {
    return getLineUnderConstruction().busLine.schools;
  };

  return (
    <div class="add-line-information-board-content">
      {/*  // !when line.shools.lenght > 0 */}
      <Show when={currentStep() == drawModeStep.schoolSelection}>
        <SelectedSchool schoolSelected={etablissementSelected()} />
      </Show>
      {/* <Show when={currentStep() > drawModeStep.schoolSelection}>
        <div class="bus-line-information-board-content">
          <TimelineAddMode
            line={getLineUnderConstruction}
            setLine={setLineUnderConstruction}
          />
        </div>
      </Show> */}
      <Show when={currentStep() == drawModeStep.editLine}>
        <div class="bus-line-information-board-content">
          <TimelineAddMode
            line={getLineUnderConstruction}
            setLine={setLineUnderConstruction}
          />
        </div>
      </Show>

      {/* <DrawModeBoardContentFooter
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

// async function nextStep() {
//   console.log("actual step=>", currentStep());
//   if (currentStep() <= drawModeStep.schoolSelection) {
//     setCurrentStep((currentStep() + 1) % 5);
//   }
//   if (currentStep() >= drawModeStep.stopSelection) {
//     if (getLineUnderConstruction().busLine.points.length < 2) {
//       return;
//     }
//     if (currentStep() == drawModeStep.stopSelection) {
//       await updatePolylineWithOsrm(getLineUnderConstruction().busLine);
//     }

//     createOrUpdateBusLine(getLineUnderConstruction().busLine);
//     // ! Ajouter setCurrentStep(0) ?!
//   }
// }
async function nextStep() {
  console.log("actual step=>", currentStep());
  if (currentStep() == drawModeStep.schoolSelection) {
    if (getLineUnderConstruction().busLine.schools.length < 1) {
      return;
    }
    // setCurrentStep((currentStep() + 1) % 5);
    setCurrentStep(drawModeStep.editLine);
  } else {
    if (getLineUnderConstruction().busLine.points.length < 2) {
      return;
    }
    if (displayLineMode() == displayLineModeEnum.straight) {
      await updatePolylineWithOsrm(getLineUnderConstruction().busLine);
    }

    createOrUpdateBusLine(getLineUnderConstruction().busLine);
    // ! Ajouter setCurrentStep(0) ?!
  }
}

// function prevStep() {
//   if (currentStep() == drawModeStep.schoolSelection) {
//     console.log("currentStep()", currentStep());

//     setLineUnderConstruction(defaultLineUnderConstruction());
//     quitModeAddLine();

//     setCurrentStep(drawModeStep.start);
//   } else if (currentStep() > drawModeStep.schoolSelection) {
//     console.log("currentStep()", currentStep());

//     setLineUnderConstruction(defaultLineUnderConstruction());
//     if (currentStep() == drawModeStep.polylineEdition) {
//       getLineUnderConstruction().busLine.setLatLngs([]);
//     }

//     setCurrentStep(drawModeStep.schoolSelection);
//     // ! useless, so delete ?
//   } else {
//     console.log("Sorry, we are out of range}.");
//   }
//   // ! cas case drawModeStep.validationStep: ?
//   // ! Refactor setCurrentStep()
// }
function prevStep() {
  if (currentStep() == drawModeStep.schoolSelection) {
    console.log("currentStep()", currentStep());

    setLineUnderConstruction(defaultLineUnderConstruction());
    quitModeAddLine();

    setCurrentStep(drawModeStep.start);
    // ! modify not use >
  } else if (currentStep() == drawModeStep.editLine) {
    console.log("currentStep()", currentStep());

    setLineUnderConstruction(defaultLineUnderConstruction());
    if (displayLineMode() == displayLineModeEnum.onRoad) {
      getLineUnderConstruction().busLine.setLatLngs([]);
    }

    setCurrentStep(drawModeStep.schoolSelection);
    // } else if (currentStep() > drawModeStep.schoolSelection) {
    //   console.log("currentStep()", currentStep());

    //   setLineUnderConstruction(defaultLineUnderConstruction());
    //   if (displayLineMode() == displayLineModeEnum.onRoad) {
    //     getLineUnderConstruction().busLine.setLatLngs([]);
    //   }

    //   setCurrentStep(drawModeStep.schoolSelection);
    // ! useless, so delete ?
  } else {
    console.log("Sorry, we are out of range}.");
  }
  setDisplayLineMode((prev) =>
    prev == displayLineModeEnum.straight ? prev : displayLineModeEnum.straight
  );
  // ! cas case drawModeStep.validationStep: ?
  // ! Refactor setCurrentStep()
}
