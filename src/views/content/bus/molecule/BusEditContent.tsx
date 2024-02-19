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
  category: string;
  accessibility: string;
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCapacityChange: (value: number) => void;
  onAccessibilityChange: (value: string) => void;
  cancelFunction: () => void;
  submitFunction: () => void;
}

export function BusEditContent(props: BusEditContentProps) {
  return (
    <div class="bus-edit-content">
      <div class="bus-edit-input">
        <VehicleNameInput
          defaultValue={props.name}
          onInputFunction={props.onNameChange}
        />
        <VehicleCapacityInput
          defaultValue={props.capacity}
          label="Capacité"
          onChangeFunction={props.onCapacityChange}
        />
        <VehicleCategoryInput
          defaultValue={props.category}
          onChangeFunction={props.onCategoryChange}
        />
        <VehicleAccessibilityInput
          defaultValue={props.accessibility}
          onChangeFunction={props.onAccessibilityChange}
        />
        <VehicleSizeInput
          defaultHeight={0}
          defaultLength={0}
          defaultWidth={0}
          onInputHeight={() => console.log("wip")}
          onInputLength={() => console.log("wip")}
          onInputWidth={() => console.log("wip")}
        />
      </div>
      <BusEditButtons
        cancelFunction={props.cancelFunction}
        submitFunction={props.submitFunction}
      />
    </div>
  );
}
