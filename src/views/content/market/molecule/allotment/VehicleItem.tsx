import { Show, createSignal, onMount } from "solid-js";
import { TransporterVehicleType } from "../../../../../_entities/transporter.entity";
import { SelectInput } from "../../../../../component/atom/SelectInput";
import CheckIcon from "../../../../../icons/CheckIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import UpdatePen from "../../../../../icons/UpdatePen";
import { TripUtils } from "../../../../../utils/trip.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getBus } from "../../../bus/organism/Bus";
import "./VehicleItem.css";

interface VehicleItemProps {
  item: TransporterVehicleType;
  edit: (
    oldvehicle: TransporterVehicleType,
    newvehicle: TransporterVehicleType
  ) => void;
  delete: (vehicle: TransporterVehicleType) => void;
}

export function VehicleItem(props: VehicleItemProps) {
  const [inEdit, setInEdit] = createSignal(false);
  const [editVehicle, setEditVehicle] = createSignal<TransporterVehicleType>(
    {} as TransporterVehicleType
  );

  onMount(() => {
    setEditVehicle(props.item);
    if (props.item.license == "" && props.item.busCategoryId == 0)
      setInEdit(true);
  });

  function onNamechange(value: string) {
    setEditVehicle((prev) => {
      return { ...prev, license: value };
    });
  }

  function onVehicleChange(value: number) {
    setEditVehicle((prev) => {
      return { ...prev, busCategoryId: value };
    });
  }

  function submit() {
    props.edit(props.item, editVehicle());
    setInEdit(false);
  }

  return (
    <Show
      fallback={
        <div>
          <p>{"Immatriculation : " + editVehicle().license}</p>
          <p>
            {"Bus : " + TripUtils.tripBusIdToString(props.item.busCategoryId)}
          </p>
          <div class="vehicle-item-buttons">
            <ButtonIcon icon={<UpdatePen />} onClick={() => setInEdit(true)} />
            <ButtonIcon
              icon={<TrashIcon />}
              onClick={() => props.delete(props.item)}
            />
          </div>
        </div>
      }
      when={inEdit()}
    >
      <div>
        <div>
          <label for="license">Immatriculation :</label>
          <input
            value={props.item.license}
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
            defaultValue={props.item.busCategoryId}
            variant="borderless"
          />
        </div>
        <ButtonIcon icon={<CheckIcon />} onClick={submit} />
      </div>
    </Show>
  );
}
