import { TransporterVehicleType } from "../../../../_entities/transporter.entity";
import { TransporterEditInputs } from "./TransporterEditInputs";
import "./TransporterEditMenuContent.css";
import { TransporterEditVehicles } from "./TransporterEditVehicles";

interface TransporterEditMenuContentProps {
  name: string;
  type: string;
  vehicles: TransporterVehicleType[];
  onNameChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  add: () => void;
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
      <TransporterEditVehicles add={props.add} vehicles={props.vehicles} />
    </div>
  );
}
