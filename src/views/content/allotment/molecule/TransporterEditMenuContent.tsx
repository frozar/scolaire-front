import { TransporterEditInputs } from "./TransporterEditInputs";
import "./TransporterEditMenuContent.css";
import { TransporterEditVehicles } from "./TransporterEditVehicles";

interface TransporterEditMenuContentProps {
  name: string;
  type: string;
  onNameChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export function TransporterEditMenuContent(
  props: TransporterEditMenuContentProps
) {
  return (
    <div class="transporter-edit-border">
      <TransporterEditInputs
        name={props.name}
        type={props.type}
        onNameChange={props.onNameChange}
        onTypeChange={props.onTypeChange}
      />
      <TransporterEditVehicles />
    </div>
  );
}
