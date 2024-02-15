import LabeledInputRadio from "../../board/component/molecule/LabeledInputRadio";

interface vehicleCategoryInputProps {
  onChangeFunction: (value: string) => void;
}

export function VehicleCategoryInput(props: vehicleCategoryInputProps) {
  return (
    <div>
      <LabeledInputRadio
        id="autocar"
        value="autocar"
        labelName="Autocar"
        name="vehicle-category"
        onChange={props.onChangeFunction}
      />
      <LabeledInputRadio
        id="bus"
        value="bus"
        labelName="Bus"
        name="vehicle-category"
        onChange={props.onChangeFunction}
      />
      <LabeledInputRadio
        id="pmr"
        value="pmr"
        labelName="Véhicule PMR"
        name="vehicle-category"
        onChange={props.onChangeFunction}
      />
    </div>
  );
}