import { Accessor, For, Setter, Show, createSignal, onMount } from "solid-js";
import { TransporterType } from "../../../../../_entities/transporter.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import { TripUtils } from "../../../../../utils/trip.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import VehicleItem from "./VehicleItem";
import { VehicleItemEdit } from "./VehicleItemEdit";
import "./VehicleList.css";

interface VehicleListProps {
  transporter: TransporterType;
  transporterSetter: Setter<TransporterType>;
}

type LocalVehicleType = {
  licensePlate: string;
  busCategoryId: number;
  inEdit: Accessor<boolean>;
  setInEdit: Setter<boolean>;
};

export function VehicleList(props: VehicleListProps) {
  const [localVehicles, setLocalVehicles] = createSignal<LocalVehicleType[]>(
    []
  );

  onMount(() => {
    props.transporter.vehicles.forEach((v) => {
      const [inEdit, setInEdit] = createSignal(false);
      const obj = {
        licensePlate: v.licensePlate,
        busCategoryId: v.busCategoryId,
        inEdit,
        setInEdit,
      };
      setLocalVehicles((prev) => {
        return [...prev, obj];
      });
    });
  });

  function addVehicle() {
    const [inEdit, setInEdit] = createSignal(false);
    setLocalVehicles((prev) => {
      return [
        ...prev,
        { busCategoryId: 0, licensePlate: "", inEdit, setInEdit },
      ];
    });
    // eslint-disable-next-line solid/reactivity
    props.transporterSetter((prev) => {
      return { ...prev, vehicles: localVehicles() };
    });
  }

  function enableEdit(vehicle: LocalVehicleType) {
    const vehicleToEdit = localVehicles().find(
      (v) =>
        v.busCategoryId === vehicle.busCategoryId &&
        v.licensePlate === vehicle.licensePlate
    );
    if (vehicleToEdit) vehicleToEdit.setInEdit(true);
  }

  function deleteVehicle(vehicle: LocalVehicleType) {
    const vehicleToDelete = localVehicles().find(
      (v) =>
        v.busCategoryId === vehicle.busCategoryId &&
        v.licensePlate === vehicle.licensePlate
    );
    if (vehicleToDelete) {
      setLocalVehicles((prev) => {
        return prev.filter((v) => v != vehicleToDelete);
      });

      // eslint-disable-next-line solid/reactivity
      props.transporterSetter((prev) => {
        return { ...prev, vehicles: localVehicles() };
      });
    }
  }

  function submitVehicle(toEdit: LocalVehicleType, edited: LocalVehicleType) {
    const vehicleToEdit = localVehicles().find(
      (v) =>
        v.busCategoryId === toEdit.busCategoryId &&
        v.licensePlate === toEdit.licensePlate
    );
    if (vehicleToEdit) {
      setLocalVehicles((prev) => {
        return prev.map((v) => {
          if (v == vehicleToEdit) {
            const [inEdit, setInEdit] = createSignal(false);
            return {
              busCategoryId: edited.busCategoryId,
              licensePlate: edited.licensePlate,
              inEdit,
              setInEdit,
            };
          }
          return v;
        });
      });
    }
    // eslint-disable-next-line solid/reactivity
    props.transporterSetter((prev) => {
      return { ...prev, vehicles: localVehicles() };
    });
  }

  return (
    <div>
      <div class="vehicle-headers">
        <p>Véhicules :</p>
        <ButtonIcon icon={<PlusIcon />} onClick={addVehicle} />
      </div>
      <div class="vehicle-list">
        <For each={localVehicles()}>
          {(item) => (
            <Show
              when={!item.inEdit()}
              fallback={
                <VehicleItemEdit
                  busCategoryId={item.busCategoryId}
                  licensePlate={item.licensePlate}
                  submitCb={submitVehicle}
                />
              }
            >
              <VehicleItem
                deleteCb={() => deleteVehicle(item)}
                enableEditCb={() => enableEdit(item)}
                vehicleName={TripUtils.tripBusIdToString(item.busCategoryId)}
                busCategoryId={item.busCategoryId}
                licensePlate={item.licensePlate}
              />
            </Show>
          )}
        </For>
      </div>
    </div>
  );
}
