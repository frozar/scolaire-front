import { createSignal } from "solid-js";
import { BusService } from "../../../../_services/bus.service";
import { addNewUserInformation } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import { VehicleMenuHeader } from "../atom/VehicleMenuHeader";
import "./AddVehicleMenu.css";
import { VehicleMenuContent } from "./VehicleMenuContent";
import { setIsVehicleMenuOpened } from "./VehicleTab";

export function AddVehicleMenu() {
  const [vehicleName, setVehicleName] = createSignal("");
  const [vehicleCapacity, setVehicleCapacity] = createSignal(0);
  const [vehicleCategory, setVehicleCategory] = createSignal("");

  function onChangeCapacity(value: number) {
    setVehicleCapacity(value);
  }

  function onChangeCategory(value: string) {
    setVehicleCategory(value);
  }

  function onChangeName(value: string) {
    setVehicleName(value);
  }

  function resetDefaultValues() {
    setVehicleCapacity(0);
    setVehicleCategory("");
    setVehicleName("");
  }

  async function createNewVehicle() {
    if (vehicleName() == "" || vehicleCategory() == "") return;
    await BusService.create({
      category: vehicleCategory(),
      capacity: vehicleCapacity(),
      name: vehicleName(),
    });
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Le véhicule " + vehicleName() + " a bien été créé",
    });
    setIsVehicleMenuOpened(false);
    resetDefaultValues();
  }

  return (
    <div class="vehicle-menu-container">
      <VehicleMenuHeader />
      <VehicleMenuContent
        capacity={vehicleCapacity()}
        category={vehicleCategory()}
        name={vehicleName()}
        submitFunction={createNewVehicle}
        onCapacityChangeFunction={onChangeCapacity}
        onCategoryChangeFunction={onChangeCategory}
        onNameChangeFunction={onChangeName}
      />
    </div>
  );
}