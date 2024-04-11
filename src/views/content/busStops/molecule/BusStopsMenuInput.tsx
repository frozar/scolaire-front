import { Setter } from "solid-js";
import {
  BusStopDirectionEnum,
  BusStopType,
} from "../../../../_entities/busStops.entity";
import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
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

  function onChangeDirection(value: string) {
    let dir = BusStopDirectionEnum.scan;
    if (value == "antiscan") dir = BusStopDirectionEnum.antiscan;
    props.setter((prev) => {
      return { ...prev, direction: dir };
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
      <LabeledInputSelect
        variant="borderless"
        defaultValue={0}
        label="Direction"
        onChange={(e) => onChangeDirection(e as string)}
        options={[
          { value: "scan", text: "scan" },
          { value: "antiscan", text: "antiscan" },
        ]}
      />
    </div>
  );
}
