import { Show, createSignal } from "solid-js";
import {
  defaultLineUnderConstruction,
  useStateAction,
} from "../../../../../StateAction";
import {
  BusLineType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-line.entity";
import { BusLineService } from "../../../../../_services/bus-line.service";
import TimelineAddMode from "../../informationBoard/TimelineAddMode";
import { quitModeAddLine } from "../../shortcut";
import SelectedSchool from "../atom/SelectedSchool";
import "./AddLineInformationBoardContent.css";
import AddLineInformationBoardContentFooter from "./AddLineInformationBoardContentFooter";
<<<<<<< HEAD
import { getBusLines, setBusLines } from "./BusLines";
=======
import { getBusLines, setBusLines } from "./BusLines";
>>>>>>> c369fb54 (plug the bus line creation with Xano)

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
  const etablissementSelected = () => {
    return getLineUnderConstruction().busLine.schools;
  };

  return (
    <div class="add-line-information-board-content">
      <header>
        <div class="add-line-information-board-content-header-title">
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
      </header>
      <Show when={currentStep() === drawModeStep.schoolSelection}>
        <SelectedSchool schoolSelected={etablissementSelected()} />
      </Show>

      <Show when={currentStep() === drawModeStep.stopSelection}>
        <div class="bus-line-information-board-content">
          <TimelineAddMode
            line={getLineUnderConstruction}
            setLine={setLineUnderConstruction}
          />
        </div>
      </Show>
      <footer>
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
      </footer>
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

  const busLines: BusLineType[] = getBusLines();
  busLines.push(newBusLine);
  setBusLines(busLines);
  // add the newBusLine to the BusLines signal
}

async function updateBusLine(busLine: BusLineType) {
  // TODO to do
  console.log("Update busLine", busLine);
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

