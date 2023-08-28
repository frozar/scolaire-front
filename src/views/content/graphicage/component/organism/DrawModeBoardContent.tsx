import { Show, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";

import TimelineAddMode from "../../informationBoard/TimelineAddMode";
import SelectedSchool from "../atom/SelectedSchool";

import "../../../../../css/timeline.css";
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
