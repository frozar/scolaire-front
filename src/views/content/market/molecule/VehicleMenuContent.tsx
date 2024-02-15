import { VehicleCapacityInput } from "./VehicleCapacityInput";
import { VehicleCategoryInput } from "./VehicleCategoryInput";
import { VehicleMenuButtons } from "./VehicleMenuButtons";
import "./VehicleMenuContent.css";
import { VehicleNameInput } from "./VehicleNameInput";

interface VehicleMenuContentProps {
  name: string;
  capacity: number;
  category: string;
  onNameChangeFunction: (value: string) => void;
  onCategoryChangeFunction: (value: string) => void;
  onCapacityChangeFunction: (value: number) => void;
  submitFunction: () => void;
}

export function VehicleMenuContent(props: VehicleMenuContentProps) {
  return (
    <div class="vehicle-menu-content">
      <VehicleNameInput
        defaultValue={props.name}
        onInputFunction={props.onNameChangeFunction}
      />
      <VehicleCapacityInput
        defaultValue={props.capacity}
        label="Capacité"
        onChangeFunction={props.onCapacityChangeFunction}
      />
      <VehicleCategoryInput onChangeFunction={props.onCategoryChangeFunction} />
      <VehicleMenuButtons submitFunction={props.submitFunction} />
    </div>
  );
}
