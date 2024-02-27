import { createSignal, onMount } from "solid-js";
import LabeledInputRadio from "../../board/component/molecule/LabeledInputRadio";

interface vehicleCategoryInputProps {
  defaultValue?: string;
  onChangeFunction: (value: string) => void;
}

export function VehicleCategoryInput(props: vehicleCategoryInputProps) {
  const [isAutocarChecked, setAutocarChecked] = createSignal(false);
  const [isBusChecked, setBusChecked] = createSignal(false);

  onMount(() => {
    if (props.defaultValue == "autocar") {
      setAutocarChecked(true);
      setBusChecked(false);
      return;
    }
    setBusChecked(true);
    setAutocarChecked(false);
  });

  return (
    <div>
      <p>Catégorie</p>
      <div class="flex">
        <LabeledInputRadio
          id="autocar"
          value="autocar"
          labelName="Autocar"
          name="vehicle-category"
          onChange={props.onChangeFunction}
          checked={isAutocarChecked()}
        />
        <LabeledInputRadio
          id="bus"
          value="bus"
          labelName="Bus"
          name="vehicle-category"
          onChange={props.onChangeFunction}
          checked={isBusChecked()}
        />
      </div>
    </div>
  );
}
