import LabeledInputRadio from "../../board/component/molecule/LabeledInputRadio";

interface vehicleCategoryInputProps {
  defaultValue?: string;
  onChangeFunction: (value: string) => void;
}

export function VehicleCategoryInput(props: vehicleCategoryInputProps) {
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
        />
        <LabeledInputRadio
          id="bus"
          value="bus"
          labelName="Bus"
          name="vehicle-category"
          onChange={props.onChangeFunction}
        />
      </div>
    </div>
  );
}
