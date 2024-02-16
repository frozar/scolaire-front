import LabeledInputRadio from "../../board/component/molecule/LabeledInputRadio";

interface VehicleAccessibilityInputProps {
  onChangeFunction: (value: string) => void;
}

export function VehicleAccessibilityInput(
  props: VehicleAccessibilityInputProps
) {
  return (
    <div>
      <p>Accessibilité</p>
      <LabeledInputRadio
        id="classic"
        value="classic"
        labelName="Classique"
        name="vehicle-accessibility"
        onChange={props.onChangeFunction}
      />
      <LabeledInputRadio
        id="PMR"
        value="PMR"
        labelName="PMR"
        name="vehicle-accessibility"
        onChange={props.onChangeFunction}
      />
    </div>
  );
}
