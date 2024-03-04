import { createSignal } from "solid-js";
import { BusService } from "../../../../_services/bus.service";
import {
  addNewGlobalSuccessInformation,
  addNewGlobalWarningInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { VehicleMenuHeader } from "../atom/VehicleMenuHeader";
import { VehicleMenuContent } from "./VehicleMenuContent";
import { setIsVehicleMenuOpened } from "./vehicle/VehicleTab";

export function AddVehicleMenu() {
  const [getName, setName] = createSignal("");
  const [getCapacity, setCapacity] = createSignal(0);
  const [getCapacityStanding, setCapacityStanding] = createSignal(0);
  const [getCategory, setCategory] = createSignal("");
  const [getAccessibility, setAccessibility] = createSignal("");
  const [getLength, setLength] = createSignal(0);
  const [getWidth, setWidth] = createSignal(0);
  const [getHeight, setHeight] = createSignal(0);
  const [isPMRSelected, setIsPMRSelected] = createSignal(false);

  function onChangeCapacity(value: number) {
    setCapacity(value);
  }

  function onChangeCapacityStanding(value: number) {
    setCapacityStanding(value);
  }

  function onChangeLength(value: number) {
    setLength(value);
  }

  function onChangeWidth(value: number) {
    setWidth(value);
  }

  function onChangeHeight(value: number) {
    setHeight(value);
  }

  function onChangeCategory(value: string) {
    setCategory(value);
  }

  function onChangeName(value: string) {
    setName(value);
  }

  function onChangeAccessibility(value: string) {
    setAccessibility(value);
    if (getAccessibility() == "PMR") setIsPMRSelected(true);
    else setIsPMRSelected(false);
  }

  function resetDefaultValues() {
    setCapacity(0);
    setLength(0);
    setWidth(0);
    setHeight(0);
    setCategory("");
    setName("");
    setAccessibility("");
  }

  async function createNewVehicle() {
    if (getName() == "") {
      addNewGlobalWarningInformation("Veuillez entrer un nom");
      return;
    }
    if (getCapacity() == 0) {
      addNewGlobalWarningInformation("Veuillez entrer la capacité du véhicule");
      return;
    }
    if (getWidth() == 0 || getHeight() == 0 || getLength() == 0) {
      addNewGlobalWarningInformation("Veuillez entrer le gabarit du véhicule");
      return;
    }
    if (getCategory() == "") setCategory("bus");
    if (getAccessibility() == "") setAccessibility("PMR");
    enableSpinningWheel();
    await BusService.create({
      category: getCategory(),
      capacity: getCapacity(),
      capacity_standing: getCapacityStanding(),
      name: getName(),
      accessibility: getAccessibility(),
      length: getLength(),
      width: getWidth(),
      height: getHeight(),
    });
    disableSpinningWheel();
    addNewGlobalSuccessInformation(
      "Le véhicule " + getName() + " a bien été créé"
    );
    setIsVehicleMenuOpened(false);
    resetDefaultValues();
  }

  return (
    <div>
      <VehicleMenuHeader />
      <VehicleMenuContent
        isPMROn={isPMRSelected()}
        capacity={getCapacity()}
        capacityStanding={getCapacityStanding()}
        category={getCategory()}
        name={getName()}
        accessibility={getAccessibility()}
        height={getHeight()}
        length={getLength()}
        width={getWidth()}
        submit={createNewVehicle}
        onCapacityChange={onChangeCapacity}
        onCategoryChange={onChangeCategory}
        onHeightChange={onChangeHeight}
        onLengthChange={onChangeLength}
        onWidthChange={onChangeWidth}
        onNameChange={onChangeName}
        onAccessibilityChange={onChangeAccessibility}
        onCapacityStandingChange={onChangeCapacityStanding}
      />
    </div>
  );
}
