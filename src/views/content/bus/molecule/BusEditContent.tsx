import { Setter, Show } from "solid-js";
import { VehicleAccessibilityInput } from "../../market/molecule/VehicleAccessibilityInput";
import { VehicleCapacityInput } from "../../market/molecule/VehicleCapacityInput";
import { VehicleCategoryInput } from "../../market/molecule/VehicleCategoryInput";
import { VehicleNameInput } from "../../market/molecule/VehicleNameInput";
import { VehicleSizeInput } from "../../market/molecule/VehicleSizeInput";
import { BusCategoryType } from "../organism/Bus";
import { BusEditButtons } from "./BusEditButtons";
import "./BusEditContent.css";

interface BusEditContentProps {
  busItem: BusCategoryType;
  setBusItem: Setter<BusCategoryType>;
  isPMROn: boolean;
  onPMRChange: (value: boolean) => void;
  cancelFunction: () => void;
  submitFunction: () => void;
}

export function BusEditContent(props: BusEditContentProps) {
  function setName(value: string) {
    props.setBusItem((prev: BusCategoryType) => {
      return { ...prev, name: value };
    });
  }

  function setCapacity(value: number) {
    props.setBusItem((prev: BusCategoryType) => {
      return { ...prev, capacity: value };
    });
  }

  function setCapacityStanding(value: number) {
    props.setBusItem((prev: BusCategoryType) => {
      return { ...prev, capacity_standing: value };
    });
  }

  function setCapacityPMR(value: number) {
    props.setBusItem((prev: BusCategoryType) => {
      return { ...prev, capacity_pmr: value };
    });
  }

  function setCategory(value: string) {
    props.setBusItem((prev: BusCategoryType) => {
      return { ...prev, category: value };
    });
  }

  function setAccess(value: string) {
    if (value == "PMR") props.onPMRChange(true);
    else props.onPMRChange(false);
    props.setBusItem((prev: BusCategoryType) => {
      return { ...prev, accessibility: value };
    });
  }

  function setLength(value: number) {
    props.setBusItem((prev: BusCategoryType) => {
      return { ...prev, length: value };
    });
  }

  function setWidth(value: number) {
    props.setBusItem((prev: BusCategoryType) => {
      return { ...prev, width: value };
    });
  }

  function setHeight(value: number) {
    props.setBusItem((prev: BusCategoryType) => {
      return { ...prev, height: value };
    });
  }

  return (
    <div class="bus-edit-content">
      <div class="bus-edit-input">
        <VehicleNameInput
          defaultValue={props.busItem.name}
          onInputFunction={setName}
        />
        <VehicleCapacityInput
          label="Capacité assis"
          name="capacitySit"
          defaultValue={props.busItem.capacity}
          onChangeFunction={setCapacity}
        />
        <VehicleCapacityInput
          label="Capacité debout"
          name="capacityStand"
          defaultValue={props.busItem.capacity_standing}
          onChangeFunction={setCapacityStanding}
        />
        <VehicleCategoryInput
          defaultValue={props.busItem.category}
          onChangeFunction={setCategory}
        />
        <VehicleAccessibilityInput
          defaultValue={props.busItem.accessibility}
          onChangeFunction={setAccess}
        />
        <Show when={props.isPMROn} fallback={<div />}>
          <VehicleCapacityInput
            label="Capacité PMR"
            name="capacityPMR"
            defaultValue={props.busItem.capacity_pmr}
            onChangeFunction={setCapacityPMR}
          />
        </Show>
        <VehicleSizeInput
          defaultLength={props.busItem.length}
          defaultWidth={props.busItem.width}
          defaultHeight={props.busItem.height}
          onInputLength={setLength}
          onInputWidth={setWidth}
          onInputHeight={setHeight}
        />
      </div>
      <BusEditButtons
        cancelFunction={props.cancelFunction}
        submitFunction={props.submitFunction}
      />
    </div>
  );
}
