import { createSignal } from "solid-js";
import { BusService } from "../../../../_services/bus.service";
import { addNewUserInformation } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import "./AddVehicleMenu.css";
import { VehicleCapacityInput } from "./VehicleCapacityInput";
import { VehicleCategoryInput } from "./VehicleCategoryInput";
import { VehicleMenuButtons } from "./VehicleMenuButtons";
import { VehicleNameInput } from "./VehicleNameInput";
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
    console.log(vehicleName());
    console.log(vehicleCapacity());
    console.log(vehicleCategory());
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
      <div class="vehicle-menu-header">
        <p>Ajouter un véhicule</p>
      </div>
      <div class="vehicle-menu-content">
        <VehicleNameInput
          defaultValue={vehicleName()}
          onInputFunction={onChangeName}
        />
        <VehicleCapacityInput
          defaultValue={vehicleCapacity()}
          label="Capacité"
          onChangeFunction={onChangeCapacity}
        />
        <VehicleCategoryInput onChangeFunction={onChangeCategory} />
        <VehicleMenuButtons submitFunction={createNewVehicle} />
      </div>
    </div>
  );
}
