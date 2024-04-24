import { Setter } from "solid-js";
import { BusStopType } from "../../../../_entities/busStops.entity";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";

interface BusStopsMenuInputProps {
  setter: Setter<BusStopType>;
}

export function BusStopsMenuInput(props: BusStopsMenuInputProps) {
  function onInputName(value: string) {
    props.setter((prev) => {
      return { ...prev, name: value };
    });
  }

  return (
    <div>
      <LabeledInputField
        label="Nom"
        name="name"
        value={""}
        placeholder="Entrer un nom"
        onInput={(e) => onInputName(e.target.value)}
      />
    </div>
  );
}
