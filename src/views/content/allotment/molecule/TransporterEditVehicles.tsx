import { For, createSignal } from "solid-js";
import "./TransporterEditVehicles.css";
import { TransporterEditVehiclesHeader } from "./TransporterEditVehiclesHeader";
import { TransporterEditVehiclesInputs } from "./TransporterEditVehiclesInputs";

export function TransporterEditVehicles() {
  const [fakeData] = createSignal([
    { licence: "a", type: "autocar" },
    { licence: "b", type: "bus" },
  ]);

  return (
    <div class="transporter-vehicles-content">
      <TransporterEditVehiclesHeader />
      <For each={fakeData()}>
        {(item) => (
          <TransporterEditVehiclesInputs
            license={item.licence}
            type={item.type}
            onLicenseChange={() => console.log("license changed")}
            onTypeChange={() => console.log("type changed")}
          />
        )}
      </For>
    </div>
  );
}
