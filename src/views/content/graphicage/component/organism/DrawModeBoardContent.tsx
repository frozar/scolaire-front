import { Show, createEffect, createSignal } from "solid-js";
import {
  defaultLineUnderConstruction,
  useStateAction,
} from "../../../../../StateAction";
import {
  BusLinePointType,
  BusLineType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-line.entity";
import { BusLineService } from "../../../../../_services/bus-line.service";
import TimelineAddMode from "../../informationBoard/TimelineAddMode";
import { quitModeAddLine } from "../../shortcut";
import SelectedSchool from "../atom/SelectedSchool";
import "./AddLineInformationBoardContent.css";
import AddLineInformationBoardContentFooter from "./AddLineInformationBoardContentFooter";
import { updateBusLines } from "./BusLines";

import "../../../../../css/timeline.css";

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
  console.log("DrawModeBoardContent");
  createEffect(() => {
    console.log("currentStep()", currentStep());
  });

  //  ! set var line soit default soit avec la LineToUpdate
  const etablissementSelected = () => {
    return getLineUnderConstruction().busLine.schools;
  };

  return (
    <div class="add-line-information-board-content">
      <div class="add-line-information-board-content-title">
        <h1>
          {
            [
              "",
              " Sélection des établissements",
              "Création de la ligne",
              "Modification de l'itinéraire",
              "Détails",
            ][currentStep()]
          }
        </h1>
      </div>
      {/* <Show when={currentStep() === drawModeStep.schoolSelection}>
        <SelectedSchool schoolSelected={etablissementSelected()} />
      </Show> */}
      {/* <Show when={currentStep() === drawModeStep.stopSelection}>
        <div class="bus-line-information-board-content">
          <TimelineAddMode
            line={getLineUnderConstruction}
            setLine={setLineUnderConstruction}
          />
        </div>
      </Show> */}
      {/*  // !when line.shools.lenght > 0 */}
      <Show when={getLineUnderConstruction().busLine.schools.length > 0}>
        <SelectedSchool schoolSelected={etablissementSelected()} />
        <div class="bus-line-information-board-content">
          <TimelineAddMode
            line={getLineUnderConstruction}
            setLine={setLineUnderConstruction}
          />
        </div>
      </Show>
      <AddLineInformationBoardContentFooter
        nextStep={{
          callback: nextStep,
          label:
            currentStep() === drawModeStep.validationStep
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
  switch (currentStep()) {
    case drawModeStep.schoolSelection:
      if (getLineUnderConstruction().busLine.schools.length == 0) {
        return;
      }
      break;
    case drawModeStep.stopSelection:
      if (getLineUnderConstruction().busLine.points.length < 2) {
        return;
      }
      // Construire getLineUnderConstruction().editLines à partir de getLineUnderConstruction().busLine
      // let i = 0
      // for (const elt of getLineUnderConstruction().busLine.points) {
      const editLinesWip: BusLineType[] = [];
      for (
        let i = 0;
        i < getLineUnderConstruction().busLine.points.length - 1;
        i++
      ) {
        editLinesWip.push({
          ...getLineUnderConstruction().busLine,
          points: [
            {
              lon: getLineUnderConstruction().busLine.points[i].lon,
              lat: getLineUnderConstruction().busLine.points[i].lat,
            },
            {
              lon: getLineUnderConstruction().busLine.points[i + 1].lon,
              lat: getLineUnderConstruction().busLine.points[i + 1].lat,
            },
          ] as BusLinePointType[],
        } as BusLineType);
      }
      console.log("editLinesWip", editLinesWip);

      setLineUnderConstruction({
        ...getLineUnderConstruction(),
        editLines: editLinesWip,
      });

      updatePolylineWithOsrm(getLineUnderConstruction().busLine);
      break;
    case drawModeStep.polylineEdition:
      console.log("Validation de la polyline");
      break;
    case drawModeStep.validationStep:
      createOrUpdateBusLine(getLineUnderConstruction().busLine);
      break;
    default:
      console.log("Sorry, we are out of range}.");
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
