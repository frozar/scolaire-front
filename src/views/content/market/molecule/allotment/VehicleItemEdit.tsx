import { Setter } from "solid-js";
import { TransporterVehicleType } from "../../../../../_entities/transporter.entity";
import { SelectInput } from "../../../../../component/atom/SelectInput";
import CheckIcon from "../../../../../icons/CheckIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getBus } from "../../../bus/organism/Bus";

interface VehicleItemEditProps {
  vehicleItem: TransporterVehicleType;
  vehicleSetter: Setter<TransporterVehicleType>;
  submit: () => void;
}

export function VehicleItemEdit(props: VehicleItemEditProps) {
  function onNamechange(value: string) {
    props.vehicleSetter((prev) => {
      return { ...prev, license: value };
    });
  }

  function onVehicleChange(value: number) {
    props.vehicleSetter((prev) => {
      return { ...prev, busCategoryId: value };
    });
  }

  return (
    <div>
      <div>
        <label for="license">Immatriculation :</label>
        <input
          value={props.vehicleItem.license}
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
          defaultValue={props.vehicleItem.busCategoryId}
          variant="borderless"
        />
      </div>
      <ButtonIcon icon={<CheckIcon />} onClick={props.submit} />
    </div>
  );
}
