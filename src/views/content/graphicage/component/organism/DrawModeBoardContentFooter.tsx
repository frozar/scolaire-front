import Button from "../../../../../component/atom/Button";
// import {
//   currentStep,
//   drawModeStep,
//   setCurrentStep,
// } from "./AddLineInformationBoardContent";

import "./DrawModeBoardContent.css";

export type addLineButtonType = { callback: () => void; label: string };
export default function (props: {
  nextStep: addLineButtonType;
  previousStep: addLineButtonType;
}) {
  return (
    <div class="add-line-information-board-content-buttons">
      <Button
        onClick={props.previousStep.callback}
        label={props.previousStep.label}
        variant="danger"
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
