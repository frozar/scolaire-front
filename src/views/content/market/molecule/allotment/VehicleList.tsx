import {
  Accessor,
  For,
  Setter,
  Show,
  createEffect,
  createSignal,
} from "solid-js";
import { TransporterVehicleType } from "../../../../../_entities/transporter.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import { TripUtils } from "../../../../../utils/trip.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import VehicleItem from "./VehicleItem";
import { VehicleItemEdit } from "./VehicleItemEdit";
import "./VehicleList.css";

interface VehicleListProps {
  vehicles: TransporterVehicleType[];
  vehicleUpdateCb: (vehicles: TransporterVehicleType[]) => void;
}

type LocalVehicleType = {
  content: Accessor<TransporterVehicleType>;
  setContent: Setter<TransporterVehicleType>;
  inEdit: Accessor<boolean>;
  setInEdit: Setter<boolean>;
};

export function VehicleList(props: VehicleListProps) {
  const [localVehicles, setLocalVehicles] = createSignal<LocalVehicleType[]>(
    []
  );

  createEffect(() => {
    setLocalVehicles(
      props.vehicles.map((v) => {
        const [content, setContent] = createSignal<TransporterVehicleType>({
          busCategoryId: v.busCategoryId,
          licensePlate: v.licensePlate,
        });
        const [inEdit, setInEdit] = createSignal(false);

        const localVehicle = {
          content,
          setContent,
          inEdit,
          setInEdit,
        };

        return localVehicle;
      })
    );
    // eslint-disable-next-line solid/reactivity
  }, props.vehicles);

  function localVehiclesToTransporterVehicles() {
    const list: TransporterVehicleType[] = [];
    localVehicles().forEach((v) =>
      list.push({
        busCategoryId: v.content().busCategoryId,
        licensePlate: v.content().licensePlate,
      })
    );
    return list;
  }

  function addVehicle() {
    const [content, setContent] = createSignal<TransporterVehicleType>({
      busCategoryId: 0,
      licensePlate: "",
    });
    const [inEdit, setInEdit] = createSignal(true);

    setLocalVehicles((prev) => {
      return [...prev, { content, setContent, inEdit, setInEdit }];
    });

    props.vehicleUpdateCb(localVehiclesToTransporterVehicles());
  }

  function enableEdit(vehicle: LocalVehicleType) {
    const vehicleToEdit = localVehicles().find(
      (v) => v.content() == vehicle.content()
    );
    if (vehicleToEdit) vehicleToEdit.setInEdit(true);
  }

  function deleteVehicle(vehicle: LocalVehicleType) {
    const vehicleToDelete = localVehicles().find(
      (v) => v.content() == vehicle.content()
    );

    if (vehicleToDelete) {
      setLocalVehicles((prev) => {
        return prev.filter((v) => v != vehicleToDelete);
      });

      props.vehicleUpdateCb(localVehiclesToTransporterVehicles());
    }
  }

  function updateVehicle(
    toEdit: TransporterVehicleType,
    edited: TransporterVehicleType
  ) {
    const vehicleToEdit = localVehicles().find(
      (v) =>
        v.content().busCategoryId === toEdit.busCategoryId &&
        v.content().licensePlate === toEdit.licensePlate
    );

    if (vehicleToEdit) {
      vehicleToEdit.setContent(edited);
      vehicleToEdit.setInEdit(false);
    }

    props.vehicleUpdateCb(localVehiclesToTransporterVehicles());
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
                  busCategoryId={item.content().busCategoryId}
                  licensePlate={item.content().licensePlate}
                  submitCb={updateVehicle}
                />
              }
            >
              <VehicleItem
                deleteCb={() => deleteVehicle(item)}
                enableEditCb={() => enableEdit(item)}
                vehicleName={TripUtils.tripBusIdToString(
                  item.content().busCategoryId
                )}
                busCategoryId={item.content().busCategoryId}
                licensePlate={item.content().licensePlate}
              />
            </Show>
          )}
        </For>
      </div>
    </div>
  );
}
