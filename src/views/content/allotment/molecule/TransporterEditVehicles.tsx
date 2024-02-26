import { For, createEffect, createSignal } from "solid-js";
import { TransporterVehicleType } from "../../../../_entities/transporter.entity";
import "./TransporterEditVehicles.css";
import { TransporterEditVehiclesHeader } from "./TransporterEditVehiclesHeader";
import { TransporterEditVehiclesInputs } from "./TransporterEditVehiclesInputs";

interface TransporterEditVehiclesProps {
  add: () => void;
  vehicles: TransporterVehicleType[];
}
export const [VehicleList, setVehicleList] = createSignal<
  TransporterVehicleType[]
>([]);

export function TransporterEditVehicles(props: TransporterEditVehiclesProps) {
  createEffect(() => {
    setVehicleList(props.vehicles);
  });

  function setLicense(idx: number, value: string) {
    setVehicleList((prev) => {
      let i = 0;
      return [...prev].map((item) => {
        if (i == idx) {
          item.license = value;
        }
        i = i + 1;
        return item;
      });
    });
  }

  function setBusId(idx: number, value: number) {
    setVehicleList((prev) => {
      let i = 0;
      return [...prev].map((item) => {
        if (i == idx) {
          item.bus_categories_id = value;
        }
        i = i + 1;
        return item;
      });
    });
  }

  return (
    <div class="transporter-vehicles-content">
      <TransporterEditVehiclesHeader add={props.add} />
      <div class="transporter-vehicles-list">
        <For each={VehicleList()}>
          {(item, i) => (
            <TransporterEditVehiclesInputs
              license={item.license}
              bus_id={item.bus_categories_id}
              index={i()}
              onLicenseChange={setLicense}
              onTypeChange={setBusId}
            />
          )}
        </For>
      </div>
    </div>
  );
}
