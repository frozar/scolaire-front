import Label from "../../board/component/atom/Label";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";
import { AllotmentEditButtons } from "./AllotmentEditButtons";
import "./AllotmentEditContent.css";

interface AllotmentEditContentProps {
  name: string;
  color: string;
  onNameInput: (value: string) => void;
  onColorInput: (value: string) => void;
  cancelFunction: () => void;
  submitFunction: () => void;
}

export function AllotmentEditContent(props: AllotmentEditContentProps) {
  return (
    <div class="allotment-edit-content">
      <div class="allotment-edit-input">
        <LabeledInputField
          label="Nom"
          name="name"
          placeholder="Entrer un nom"
          value={props.name}
          onInput={(e) => props.onNameInput(e.target.value)}
        />
      </div>
      <div class="allotment-edit-input-color">
        <Label label="Couleur" for="colorEdit" />
        <input
          id="colorEdit"
          type="color"
          value={props.color}
          onInput={(e) => props.onColorInput(e.target.value)}
        />
      </div>
      <AllotmentEditButtons
        cancelFunction={props.cancelFunction}
        submitFunction={props.submitFunction}
      />
    </div>
  );
}
