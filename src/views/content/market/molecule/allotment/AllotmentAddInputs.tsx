import Label from "../../../board/component/atom/Label";
import LabeledInputField from "../../../board/component/molecule/LabeledInputField";
import "./AllotmentAddMenu.css";

interface AllotmentAddInputsProps {
  defaultName: string;
  defaultColor: string;
  nameChange: (name: string) => void;
  colorChange: (color: string) => void;
}

export function AllotmentAddInputs(props: AllotmentAddInputsProps) {
  return (
    <div class="allotment-add-input-container">
      <div class="allotment-add-input">
        <LabeledInputField
          label="Nom"
          name="name"
          placeholder="Entrer un nom"
          value={props.defaultName}
          onInput={(e) => props.nameChange(e.target.value)}
        />
      </div>
      <div class="allotment-add-input-color">
        <Label label="Couleur" for="colorEdit" />
        <input
          id="colorEdit"
          type="color"
          value={props.defaultColor}
          onInput={(e) => props.colorChange(e.target.value)}
        />
      </div>
    </div>
  );
}
