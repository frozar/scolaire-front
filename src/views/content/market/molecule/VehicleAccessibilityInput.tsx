import { createSignal, onMount } from "solid-js";
import LabeledInputRadio from "../../board/component/molecule/LabeledInputRadio";

interface VehicleAccessibilityInputProps {
  defaultValue?: string;
  onChangeFunction: (value: string) => void;
}

export function VehicleAccessibilityInput(
  props: VehicleAccessibilityInputProps
) {
  const [isClassicChecked, setClassicChecked] = createSignal(false);
  const [isPMRChecked, setPMRChecked] = createSignal(false);

  onMount(() => {
    if (props.defaultValue == "classic") {
      setClassicChecked(true);
      setPMRChecked(false);
      return;
    }
    setPMRChecked(true);
    setClassicChecked(false);
  });

  return (
    <div>
      <p>Accessibilité</p>
      <div class="flex">
        <LabeledInputRadio
          id="classic"
          value="classic"
          labelName="Classique"
          name="vehicle-accessibility"
          onChange={props.onChangeFunction}
          checked={isClassicChecked()}
        />
        <LabeledInputRadio
          id="PMR"
          value="PMR"
          labelName="PMR"
          name="vehicle-accessibility"
          onChange={props.onChangeFunction}
          checked={isPMRChecked()}
        />
      </div>
    </div>
  );
}
