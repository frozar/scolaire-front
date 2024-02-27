import { Show, createSignal } from "solid-js";
import Button from "../../../../../component/atom/Button";
import { BusTable } from "../../../bus/organism/BusTable";
import { AddVehicleMenu } from "../AddVehicleMenu";
import "./VehicleTab.css";

export const [isVehicleMenuOpened, setIsVehicleMenuOpened] =
  createSignal(false);

export function VehicleTab() {
  function openVehicleMenu() {
    if (!isVehicleMenuOpened) return;
    setIsVehicleMenuOpened(true);
  }

  return (
    <div class="vehicle-tab-container">
      <Button label="Ajouter" onClick={openVehicleMenu} />
      <BusTable />
      <Show when={isVehicleMenuOpened()}>
        <AddVehicleMenu />
      </Show>
    </div>
  );
}
