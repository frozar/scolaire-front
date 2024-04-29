import { Setter, Show } from "solid-js";
import { BusCategoryType } from "../../bus/organism/Bus";
import { VehicleAccessibilityInput } from "./VehicleAccessibilityInput";
import { VehicleCapacityInput } from "./VehicleCapacityInput";
import { VehicleCategoryInput } from "./VehicleCategoryInput";
import { VehicleMenuButtons } from "./VehicleMenuButtons";
import "./VehicleMenuContent.css";
import { VehicleNameInput } from "./VehicleNameInput";
import { VehicleNumberInput } from "./VehicleNumberInput";
import { VehicleSizeInput } from "./VehicleSizeInput";

interface VehicleMenuContentProps {
  busItem: BusCategoryType;
  setBusItem: Setter<BusCategoryType>;
  isPMROn: boolean;
  setIsPMROn: Setter<boolean>;
  submit: () => void;
}

export function VehicleMenuContent(props: VehicleMenuContentProps) {
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

  function setCost(value: number) {
    props.setBusItem((prev: BusCategoryType) => {
      return { ...prev, cost: value };
    });
  }

  function setCostHlp(value: number) {
    props.setBusItem((prev: BusCategoryType) => {
      return { ...prev, cost_hlp: value };
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
    if (value == "PMR") props.setIsPMROn(true);
    else props.setIsPMROn(false);
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
    <div class="vehicle-menu-content-container">
      <div class="vehicle-menu-content">
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
        <VehicleCategoryInput onChangeFunction={setCategory} />
        <VehicleAccessibilityInput onChangeFunction={setAccess} />
        <Show when={props.isPMROn} fallback={<div />}>
          <VehicleCapacityInput
            label="Capacité PMR"
            name="capacityPMR"
            defaultValue={props.busItem.capacity_pmr}
            onChangeFunction={setCapacityPMR}
          />
        </Show>
        <div>
          <VehicleNumberInput
            defaultValue={0}
            label="Coût/km service"
            name="cost"
            placeholder="1"
            onChange={setCost}
          />
          <VehicleNumberInput
            defaultValue={0}
            label="Coût/km hlp"
            name="costhlp"
            placeholder="1"
            onChange={setCostHlp}
          />
        </div>
        <VehicleSizeInput
          defaultHeight={props.busItem.height}
          defaultLength={props.busItem.length}
          defaultWidth={props.busItem.width}
          onInputLength={setLength}
          onInputWidth={setWidth}
          onInputHeight={setHeight}
        />
      </div>
      <VehicleMenuButtons submitFunction={props.submit} />
    </div>
  );
}
