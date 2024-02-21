import "./TransporterEditVehicles.css";
import { TransporterEditVehiclesHeader } from "./TransporterEditVehiclesHeader";
import { TransporterEditVehiclesInputs } from "./TransporterEditVehiclesInputs";

export function TransporterEditVehicles() {
  return (
    <div class="transporter-vehicles-content">
      <TransporterEditVehiclesHeader />
      <TransporterEditVehiclesInputs />
    </div>
  );
}
