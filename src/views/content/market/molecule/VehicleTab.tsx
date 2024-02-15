import { Show, createSignal } from "solid-js";
import Button from "../../../../component/atom/Button";
import { getBus } from "../../bus/organism/Bus";
import { BusTable } from "../../bus/organism/BusTable";
import { AddVehicleMenu } from "./AddVehicleMenu";
import "./MarketTabItems.css";

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
      <BusTable busList={getBus()} />
      <Show when={isVehicleMenuOpened()}>
        <AddVehicleMenu />
      </Show>
    </div>
  );
}
