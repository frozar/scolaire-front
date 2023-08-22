import { Show, createSignal } from "solid-js";
import {
  defaultLineUnderConstruction,
  useStateAction,
} from "../../../../../StateAction";
import { updatePolylineWithOsrm } from "../../../../../_entities/bus-line.entity";
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
      console.log("Validation finale");
      console.log(getLineUnderConstruction().busLine);

      //TODO Fetch to have id bus line
      updateBusLines(getLineUnderConstruction().busLine);
      quitModeAddLine();
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
      if (getLineUnderConstruction().busLine.id) {
        quitModeAddLine();
      }
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
