import { For } from "solid-js";
import { TransporterVehicleType } from "../../../../_entities/transporter.entity";
import "./TransporterEditVehicles.css";
import { TransporterEditVehiclesHeader } from "./TransporterEditVehiclesHeader";
import { TransporterEditVehiclesInputs } from "./TransporterEditVehiclesInputs";

interface TransporterEditVehiclesProps {
  add: () => void;
  vehicles: TransporterVehicleType[];
}

export function TransporterEditVehicles(props: TransporterEditVehiclesProps) {
  return (
    <div class="transporter-vehicles-content">
      <TransporterEditVehiclesHeader add={props.add} />
      <For each={props.vehicles}>
        {(item) => (
          <TransporterEditVehiclesInputs
            license={item.license}
            bus_id={item.bus_category_id}
            onLicenseChange={() => console.log("license changed")}
            onTypeChange={() => console.log("type changed")}
          />
        )}
      </For>
    </div>
  );
}
