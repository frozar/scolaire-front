import { createSignal } from "solid-js";
import { BusService } from "../../../../_services/bus.service";
import {
  addNewUserInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import { VehicleMenuHeader } from "../atom/VehicleMenuHeader";
import { VehicleMenuContent } from "./VehicleMenuContent";
import { setIsVehicleMenuOpened } from "./vehicle/VehicleTab";

export function AddVehicleMenu() {
  const [getName, setName] = createSignal("");
  const [getCapacity, setCapacity] = createSignal(0);
  const [getCategory, setCategory] = createSignal("");
  const [getAccessibility, setAccessibility] = createSignal("");
  const [getLength, setLength] = createSignal(0);
  const [getWidth, setWidth] = createSignal(0);
  const [getHeight, setHeight] = createSignal(0);

  function onChangeCapacity(value: number) {
    setCapacity(value);
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
    console.log(getAccessibility());
    if (getName() == "") {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content: "Veuillez entrer un nom",
      });
      return;
    }
    if (getCapacity() == 0) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content: "Veuillez entrer la capacité du véhicule",
      });
      return;
    }
    if (getWidth() == 0 || getHeight() == 0 || getLength() == 0) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content: "Veuillez entrer le gabarit du véhicule",
      });
      return;
    }
    if (getCategory() == "") setCategory("bus");
    if (getAccessibility() == "") setAccessibility("PMR");
    enableSpinningWheel();
    await BusService.create({
      category: getCategory(),
      capacity: getCapacity(),
      name: getName(),
      accessibility: getAccessibility(),
      length: getLength(),
      width: getWidth(),
      height: getHeight(),
    });
    disableSpinningWheel();
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Le véhicule " + getName() + " a bien été créé",
    });
    setIsVehicleMenuOpened(false);
    resetDefaultValues();
  }

  return (
    <div>
      <VehicleMenuHeader />
      <VehicleMenuContent
        capacity={getCapacity()}
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
      />
    </div>
  );
}
