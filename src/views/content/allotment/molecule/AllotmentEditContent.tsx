import "./AllotmentEditContent.css";
import { AllotmentEditInputs } from "./AllotmentEditInputs";
import { TransporterTable } from "./TransporterTable";

interface AllotmentEditContentProps {
  allotment_id?: number;
  name: string;
  color: string;
  onNameInput: (value: string) => void;
  onColorInput: (value: string) => void;
}

export function AllotmentEditContent(props: AllotmentEditContentProps) {
  return (
    <div class="allotment-edit-border">
      <AllotmentEditInputs
        color={props.color}
        name={props.name}
        onColorInput={props.onColorInput}
        onNameInput={props.onNameInput}
      />
      <TransporterTable allotment_id={props.allotment_id} />
    </div>
  );
}
