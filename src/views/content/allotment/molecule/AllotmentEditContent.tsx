import { AllotmentEditButtons } from "./AllotmentEditButtons";
import "./AllotmentEditContent.css";
import { AllotmentEditInputs } from "./AllotmentEditInputs";
import { TransporterTable } from "./TransporterTable";

interface AllotmentEditContentProps {
  name: string;
  color: string;
  onNameInput: (value: string) => void;
  onColorInput: (value: string) => void;
  cancelFunction: () => void;
  submitFunction: () => void;
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
      <AllotmentEditButtons
        cancelFunction={props.cancelFunction}
        submitFunction={props.submitFunction}
      />
      <br />
      <TransporterTable />
    </div>
  );
}
