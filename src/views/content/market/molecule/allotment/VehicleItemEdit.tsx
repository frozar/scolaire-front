import { onMount } from "solid-js";
import { SelectInput } from "../../../../../component/atom/SelectInput";
import CheckIcon from "../../../../../icons/CheckIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getBus } from "../../../bus/organism/Bus";
import "./VehicleItem.css";

interface VehicleItemEditProps {
  submitCb: (
    toEdit: LocalVehicleContentType,
    edited: LocalVehicleContentType
  ) => void;
  licensePlate: string;
  busCategoryId: number;
}

type LocalVehicleContentType = {
  licensePlate: string;
  busCategoryId: number;
};

export function VehicleItemEdit(props: VehicleItemEditProps) {
  const initialVehicle: LocalVehicleContentType = {} as LocalVehicleContentType;
  const editedVehicle: LocalVehicleContentType = {} as LocalVehicleContentType;

  function onNamechange(value: string) {
    editedVehicle.licensePlate = value;
  }

  function onVehicleChange(value: number) {
    editedVehicle.busCategoryId = value;
  }

  onMount(() => {
    initialVehicle.busCategoryId = props.busCategoryId;
    initialVehicle.licensePlate = props.licensePlate;
    editedVehicle.licensePlate = props.licensePlate;
    editedVehicle.busCategoryId = props.busCategoryId;
  });

  return (
    <div class="vehicle-item-container">
      <div class="vehicle-item-field-container">
        <label for="license">Immatriculation :</label>
        <input
          value={props.licensePlate}
          class="vehicle-item-licence"
          type="text"
          id="license"
          onInput={(e) => onNamechange(e.target.value)}
        />
      </div>
      <div>
        <label>Bus :</label>
        <SelectInput
          options={getBus().map((bus) => {
            return { value: Number(bus.id), text: bus.name };
          })}
          onChange={(e) => onVehicleChange(Number(e))}
          defaultValue={props.busCategoryId}
          variant="borderless"
        />
      </div>
      <ButtonIcon
        icon={<CheckIcon />}
        onClick={() => props.submitCb(initialVehicle, editedVehicle)}
      />
    </div>
  );
}
