import { Show, createSignal, onMount } from "solid-js";
import { TransporterVehicleType } from "../../../../../_entities/transporter.entity";
import TrashIcon from "../../../../../icons/TrashIcon";
import UpdatePen from "../../../../../icons/UpdatePen";
import { TripUtils } from "../../../../../utils/trip.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import "./VehicleItem.css";
import { VehicleItemEdit } from "./VehicleItemEdit";

interface VehicleItemProps {
  item: TransporterVehicleType;
  editCb: (
    oldvehicle: TransporterVehicleType,
    newvehicle: TransporterVehicleType
  ) => void;
  deleteCb: (vehicle: TransporterVehicleType) => void;
}

export default function VehicleItem(props: VehicleItemProps) {
  const [inEdit, setInEdit] = createSignal(false);
  const [editVehicle, setEditVehicle] = createSignal<TransporterVehicleType>(
    {} as TransporterVehicleType
  );

  onMount(() => {
    setEditVehicle(props.item);
    if (props.item.license == "" && props.item.busCategoryId == 0)
      setInEdit(true);
  });

  function submit() {
    props.editCb(props.item, editVehicle());
    setInEdit(false);
  }

  return (
    <Show
      fallback={
        <VehicleItemEdit
          submit={submit}
          vehicleItem={editVehicle()}
          vehicleSetter={setEditVehicle}
        />
      }
      when={!inEdit()}
    >
      <div class="vehicle-item-container">
        <p>{"Immatriculation : " + editVehicle().license}</p>
        <p>
          {"Bus : " + TripUtils.tripBusIdToString(props.item.busCategoryId)}
        </p>
        <div class="vehicle-item-buttons">
          <ButtonIcon icon={<UpdatePen />} onClick={() => setInEdit(true)} />
          <ButtonIcon
            icon={<TrashIcon />}
            onClick={() => props.deleteCb(props.item)}
          />
        </div>
      </div>
    </Show>
  );
}
