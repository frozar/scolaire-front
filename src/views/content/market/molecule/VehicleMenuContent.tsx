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
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCapacityChange: (value: number) => void;
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
          defaultHeight={3}
          defaultLength={20}
          defaultWidth={3}
          onInputHeight={(e) => console.log(e)}
          onInputLength={(e) => console.log(e)}
          onInputWidth={(e) => console.log(e)}
        />
      </div>
      <VehicleMenuButtons submitFunction={props.submit} />
    </div>
  );
}
