import { Show } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { updatePolylineWithOsrm } from "../../../../../_entities/bus-line.entity";
import Button from "../../../../../component/atom/Button";
import {
  currentStep,
  displayLineMode,
  displayLineModeEnum,
  drawModeStep,
  setDisplayLineMode,
} from "./DrawModeBoardContent";

import "./DrawModeBoardContent.css";

const [, { getLineUnderConstruction }] = useStateAction();

export type addLineButtonType = { callback: () => void; label: string };
export default function (props: {
  nextStep: addLineButtonType;
  previousStep: addLineButtonType;
}) {
  async function onClick() {
    if (displayLineMode() == displayLineModeEnum.straight) {
      if (getLineUnderConstruction().busLine.points.length < 2) {
        return;
      }
      await updatePolylineWithOsrm(getLineUnderConstruction().busLine);
      setDisplayLineMode(displayLineModeEnum.onRoad);
    } else if (displayLineMode() == displayLineModeEnum.onRoad) {
      getLineUnderConstruction().busLine.setLatLngs([]);
      setDisplayLineMode(displayLineModeEnum.straight);
    }
  }
  return (
    <div class="add-line-information-board-content-buttons">
      <Show when={currentStep() == drawModeStep.editLine}>
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
