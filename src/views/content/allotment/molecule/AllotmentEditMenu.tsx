import { AllotmentEditHeader } from "../atom/AllotmentEditHeader";
import { AllotmentEditContent } from "./AllotmentEditContent";

interface AllotmentEditMenuProps {
  id?: number;
  name: string;
  color: string;
  onNameInput: (name: string) => void;
  onColorInput: (color: string) => void;
}

export function AllotmentEditMenu(props: AllotmentEditMenuProps) {
  return (
    <div>
      <AllotmentEditHeader title={props.name} />
      <AllotmentEditContent
        allotment_id={props.id}
        color={props.color}
        name={props.name}
        onColorInput={props.onColorInput}
        onNameInput={props.onNameInput}
      />
    </div>
  );
}
