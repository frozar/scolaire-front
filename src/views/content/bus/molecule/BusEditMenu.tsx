import { BusEditContent } from "./BusEditContent";
import { BusEditHeader } from "./BusEditHeader";

interface BusEditMenuProps {
  id?: number;
  name: string;
  capacity: number;
  capacityStand: number;
  category: string;
  access: string;
  length: number;
  width: number;
  height: number;
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCapacityChange: (value: number) => void;
  onCapacityStandChange: (value: number) => void;
  onAccessibilityChange: (value: string) => void;
  onLengthChange: (value: number) => void;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  cancelFunction: () => void;
  submitFunction: () => void;
}

export function BusEditMenu(props: BusEditMenuProps) {
  return (
    <div>
      <BusEditHeader title={props.name} />
      <BusEditContent
        accessibility={props.access}
        capacity={props.capacity}
        capacityStand={props.capacityStand}
        category={props.category}
        name={props.name}
        height={props.height}
        length={props.length}
        width={props.width}
        cancelFunction={props.cancelFunction}
        onAccessibilityChange={props.onAccessibilityChange}
        onCapacityChange={props.onCapacityChange}
        onCapacityStandChange={props.onCapacityStandChange}
        onCategoryChange={props.onCategoryChange}
        onNameChange={props.onNameChange}
        onLengthChange={props.onLengthChange}
        onWidthChange={props.onWidthChange}
        onHeightChange={props.onHeightChange}
        submitFunction={props.submitFunction}
      />
    </div>
  );
}
