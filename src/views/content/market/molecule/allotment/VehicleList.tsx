import { For, Setter, createSignal, onMount } from "solid-js";
import {
  TransporterType,
  TransporterVehicleType,
} from "../../../../../_entities/transporter.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { VehicleItem } from "./VehicleItem";

interface VehicleListProps {
  transporter: TransporterType;
  transporterSetter: Setter<TransporterType>;
}

export function VehicleList(props: VehicleListProps) {
  const [localVehicles, setLocalVehicles] = createSignal<
    TransporterVehicleType[]
  >([]);

  onMount(() => {
    setLocalVehicles(props.transporter.vehicles);
  });

  function addVehicle() {
    const newObj: TransporterVehicleType = { license: "", busCategoryId: 0 };
    setLocalVehicles((prev) => {
      return [...prev, newObj];
    });
    // eslint-disable-next-line solid/reactivity
    props.transporterSetter((prev) => {
      return { ...prev, vehicles: localVehicles() };
    });
  }

  function editVehicle(
    oldvehicle: TransporterVehicleType,
    newvehicle: TransporterVehicleType
  ) {
    setLocalVehicles((prev) => {
      return prev.map((v) => {
        if (v == oldvehicle) return newvehicle;
        return v;
      });
    });
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
          {(item) => <VehicleItem edit={editVehicle} item={item} />}
        </For>
      </div>
    </div>
  );
}
