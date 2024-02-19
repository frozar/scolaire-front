import { BusEditContent } from "./BusEditContent";
import { BusEditHeader } from "./BusEditHeader";

interface BusEditMenuProps {
  id?: number;
  name: string;
  capacity: number;
  category: string;
  access: string;
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCapacityChange: (value: number) => void;
  onAccessibilityChange: (value: string) => void;
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
        category={props.category}
        name={props.name}
        cancelFunction={props.cancelFunction}
        onAccessibilityChange={props.onAccessibilityChange}
        onCapacityChange={props.onCapacityChange}
        onCategoryChange={props.onCategoryChange}
        onNameChange={props.onNameChange}
        submitFunction={props.submitFunction}
      />
    </div>
  );
}
