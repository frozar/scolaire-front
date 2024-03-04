import { For, createSignal } from "solid-js";
import { addNewGlobalWarningInformation } from "../../../../signaux";
import { getBus } from "../../bus/organism/Bus";
import { TransporterAddButtons } from "./TransporterAddButtons";
import { TransporterAddHeader } from "./TransporterAddHeader";
import { TransporterAddInputs } from "./TransporterAddInputs";
import "./TransporterAddMenu.css";
import { TransporterAddvehicle } from "./TransporterAddVehicle";
import { TransporterAddvehicleHeader } from "./TransporterAddVehicleHeader";

interface TransporterAddMenuProps {
  name: string;
  type: string;
  nameChange: (name: string) => void;
  typeChange: (type: string) => void;
  cancel: () => void;
  submit: () => void;
}

type newVehicle = {
  id: number;
  license: string;
  bus_categories_id: number;
};

export const [getNewVehicles, setNewVehicles] = createSignal<newVehicle[]>([]);

export function TransporterAddMenu(props: TransporterAddMenuProps) {
  let newVehicleId = 0;

  function addVehicle() {
    if (getBus().length <= 0) {
      addNewGlobalWarningInformation("Aucun véhicule n'a encore été créé");
      return;
    }
    setNewVehicles((prev) => {
      return [
        ...prev,
        {
          id: ++newVehicleId,
          license: "",
          bus_categories_id: Number(getBus()[0].id),
        },
      ];
    });
  }

  function onNameChange(id: number, name: string) {
    setNewVehicles((prev) =>
      prev.map((item) => {
        if (item.id == id) {
          item.license = name;
        }
        return item;
      })
    );
  }

  function onTypeChange(id: number, type: number) {
    setNewVehicles((prev) =>
      prev.map((item) => {
        if (item.id == id) {
          item.bus_categories_id = type;
        }
        return item;
      })
    );
  }

  return (
    <div>
      <TransporterAddHeader />
      <div class="transporter-add-border">
        <TransporterAddInputs
          name={props.name}
          nameChange={props.nameChange}
          type={props.type}
          typeChange={props.typeChange}
        />
        <TransporterAddvehicleHeader add={addVehicle} />
        <For each={getNewVehicles()}>
          {(item) => (
            <TransporterAddvehicle
              busId={item.bus_categories_id}
              index={item.id}
              license={item.license}
              licenseChange={onNameChange}
              typeChange={onTypeChange}
            />
          )}
        </For>
        <TransporterAddButtons submit={props.submit} cancel={props.cancel} />
      </div>
    </div>
  );
}
