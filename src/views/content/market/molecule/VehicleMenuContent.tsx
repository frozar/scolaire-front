import { VehicleAccessibilityInput } from "./VehicleAccessibilityInput";
import { VehicleCapacityInput } from "./VehicleCapacityInput";
import { VehicleCategoryInput } from "./VehicleCategoryInput";
import { VehicleMenuButtons } from "./VehicleMenuButtons";
import "./VehicleMenuContent.css";
import { VehicleNameInput } from "./VehicleNameInput";
import { VehicleSizeInput } from "./VehicleSizeInput";

interface VehicleMenuContentProps {
  name: string;
  capacity: number;
  category: string;
  accessibility: string;
  length: number;
  width: number;
  height: number;
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCapacityChange: (value: number) => void;
  onWidthChange: (value: number) => void;
  onLengthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onAccessibilityChange: (value: string) => void;
  submit: () => void;
}

export function VehicleMenuContent(props: VehicleMenuContentProps) {
  return (
    <div class="vehicle-menu-content-container">
      <div class="vehicle-menu-content">
        <VehicleNameInput
          defaultValue={props.name}
          onInputFunction={props.onNameChange}
        />
        <VehicleCapacityInput
          defaultValue={props.capacity}
          label="Capacité"
          onChangeFunction={props.onCapacityChange}
        />
        <VehicleCategoryInput onChangeFunction={props.onCategoryChange} />
        <VehicleAccessibilityInput
          onChangeFunction={props.onAccessibilityChange}
        />
        <VehicleSizeInput
          defaultHeight={props.height}
          defaultLength={props.length}
          defaultWidth={props.width}
          onInputHeight={props.onHeightChange}
          onInputLength={props.onLengthChange}
          onInputWidth={props.onWidthChange}
        />
      </div>
      <VehicleMenuButtons submitFunction={props.submit} />
    </div>
  );
}
