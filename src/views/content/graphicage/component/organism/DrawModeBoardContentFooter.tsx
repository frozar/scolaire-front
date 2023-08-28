import { Show } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { updatePolylineWithOsrm } from "../../../../../_entities/bus-line.entity";
import Button from "../../../../../component/atom/Button";
// import {
//   currentStep,
//   drawModeStep,
//   setCurrentStep,
// } from "./AddLineInformationBoardContent";
import {
  currentStep,
  displayLineMode,
  displayLineModeEnum,
  drawModeStep,
  setDisplayLineMode,
} from "./DrawModeBoardContent";
// import "./AddLineInformationBoardContent.css";
import "./DrawModeBoardContent.css";

const [, { getLineUnderConstruction }] = useStateAction();

export type addLineButtonType = { callback: () => void; label: string };
export default function (props: {
  nextStep: addLineButtonType;
  previousStep: addLineButtonType;
}) {
  // function onClick() {
  //   if (currentStep() == drawModeStep.stopSelection) {
  //     if (getLineUnderConstruction().busLine.points.length < 2) {
  //       return;
  //     }
  //     updatePolylineWithOsrm(getLineUnderConstruction().busLine);
  //     // ! Changement de drawModeStep
  //     setCurrentStep((currentStep() + 1) % 5);
  //   } else if (currentStep() == drawModeStep.polylineEdition) {
  //     getLineUnderConstruction().busLine.setLatLngs([]);
  //     // ! Changement de drawModeStep
  //     const step = currentStep() - 1;
  //     setCurrentStep(step > 0 ? step : 0);
  //   }
  // }
  async function onClick() {
    console.log("onClick displayLineMode=>", displayLineMode());

    if (displayLineMode() == displayLineModeEnum.straight) {
      if (getLineUnderConstruction().busLine.points.length < 2) {
        return;
      }
      await updatePolylineWithOsrm(getLineUnderConstruction().busLine);
      setDisplayLineMode(displayLineModeEnum.onRoad);
      // ! Changement de drawModeStep
      // setCurrentStep((currentStep() + 1) % 5);
    } else if (displayLineMode() == displayLineModeEnum.onRoad) {
      getLineUnderConstruction().busLine.setLatLngs([]);
      setDisplayLineMode(displayLineModeEnum.straight);
      // ! Changement de drawModeStep
      // const step = currentStep() - 1;
      // setCurrentStep(step > 0 ? step : 0);
    }
  }
  return (
    <div class="add-line-information-board-content-buttons">
      {/* <Show when={currentStep() > drawModeStep.schoolSelection}> */}
      {/* // TODO: Déplacer */}
      {/* <Button
          onClick={onClick}
          label={
            displayLineMode() == displayLineModeEnum.straight
              ? "Afficher tracé sur route"
              : "Afficher tracé vol d'oiseau"
          }
          variant="primary"
          isDisabled={false}
        />
      </Show> */}
      <Show when={currentStep() == drawModeStep.editLine}>
        {/* // TODO: Déplacer */}
        <Button
          onClick={onClick}
          label={
            displayLineMode() == displayLineModeEnum.straight
              ? "Afficher tracé sur route"
              : "Afficher tracé vol d'oiseau"
          }
          variant="primary"
          isDisabled={false}
        />
      </Show>
      <Button
        onClick={props.previousStep.callback}
        label={props.previousStep.label}
        variant="primary"
        isDisabled={false}
      />
      <Button
        onClick={props.nextStep.callback}
        label={props.nextStep.label}
        variant="primary"
        isDisabled={false}
      />
    </div>
  );
}
