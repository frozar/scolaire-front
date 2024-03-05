import { Show } from "solid-js";
import { VehicleAccessibilityInput } from "../../market/molecule/VehicleAccessibilityInput";
import { VehicleCapacityInput } from "../../market/molecule/VehicleCapacityInput";
import { VehicleCategoryInput } from "../../market/molecule/VehicleCategoryInput";
import { VehicleNameInput } from "../../market/molecule/VehicleNameInput";
import { VehicleSizeInput } from "../../market/molecule/VehicleSizeInput";
import { BusEditButtons } from "./BusEditButtons";
import "./BusEditContent.css";

interface BusEditContentProps {
  name: string;
  capacity: number;
  capacityStand: number;
  capacityPMR: number;
  category: string;
  accessibility: string;
  length: number;
  width: number;
  height: number;
  isPMROn: boolean;
  onPMRChange: (value: boolean) => void;
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCapacityChange: (value: number) => void;
  onCapacityStandChange: (value: number) => void;
  onCapacityPMRChange: (value: number) => void;
  onAccessibilityChange: (value: string) => void;
  onLengthChange: (value: number) => void;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  cancelFunction: () => void;
  submitFunction: () => void;
}

export function BusEditContent(props: BusEditContentProps) {
  function AccessChanged(value: string) {
    if (value == "PMR") props.onPMRChange(true);
    else props.onPMRChange(false);
    props.onAccessibilityChange(value);
  }

  return (
    <div class="bus-edit-content">
      <div class="bus-edit-input">
        <VehicleNameInput
          defaultValue={props.name}
          onInputFunction={props.onNameChange}
        />
        <VehicleCapacityInput
          label="Capacité assis"
          name="capacitySit"
          defaultValue={props.capacity}
          onChangeFunction={props.onCapacityChange}
        />
        <VehicleCapacityInput
          label="Capacité debout"
          name="capacityStand"
          defaultValue={props.capacityStand}
          onChangeFunction={props.onCapacityStandChange}
        />
        <VehicleCategoryInput
          defaultValue={props.category}
          onChangeFunction={props.onCategoryChange}
        />
        <VehicleAccessibilityInput
          defaultValue={props.accessibility}
          onChangeFunction={AccessChanged}
        />
        <Show when={props.isPMROn} fallback={<div />}>
          <VehicleCapacityInput
            label="Capacité PMR"
            name="capacityPMR"
            defaultValue={props.capacityPMR}
            onChangeFunction={props.onCapacityPMRChange}
          />
        </Show>
        <VehicleSizeInput
          defaultLength={props.length}
          defaultWidth={props.width}
          defaultHeight={props.height}
          onInputLength={props.onLengthChange}
          onInputWidth={props.onWidthChange}
          onInputHeight={props.onHeightChange}
        />
      </div>
      <BusEditButtons
        cancelFunction={props.cancelFunction}
        submitFunction={props.submitFunction}
      />
    </div>
  );
}
