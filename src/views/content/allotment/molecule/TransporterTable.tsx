import { For, Show, createEffect, createSignal } from "solid-js";
import {
  TransporterType,
  TransporterVehicleType,
} from "../../../../_entities/transporter.entity";
import { TransporterService } from "../../../../_services/transporter.service";
import Button from "../../../../component/atom/Button";
import { TableContent } from "../../../../component/table/molecule/TableContent";
import { Table } from "../../../../component/table/organism/Table";
import {
  addNewGlobalSuccessInformation,
  addNewGlobalWarningInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import {
  TransporterAddMenu,
  getNewVehicles,
  setNewVehicles,
} from "./TransporterAddMenu";
import { TransporterTableHeader } from "./TransporterTableHeader";
import { TransporterTableLine } from "./TransporterTableLine";

export const [getAllTransporter, setAllTransporter] = createSignal<
  TransporterType[]
>([]);

export function TransporterTable(props: { allotment_id?: number }) {
  const [getTransporter, setTransporter] = createSignal<TransporterType[]>([]);
  const [newName, setNewName] = createSignal("");
  const [newType, setNewType] = createSignal("");
  const [isTransporterAddOpen, setIsTransporterAddOpen] = createSignal(false);

  createEffect(() => {
    setTransporter(
      getAllTransporter().filter((t) => t.allotment_id == props.allotment_id)
    );
  });

  function idToType(id: number) {
    switch (id) {
      case 0:
        return "Titulaire";
      case 1:
        return "Co-traitant";
      case 2:
        return "Sous-traitant";
      default:
        return "";
    }
  }

  function setTransporterVehicles() {
    const vehiclelist: TransporterVehicleType[] = [];
    getNewVehicles().forEach((vehicle) => {
      vehiclelist.push({
        license: vehicle.license,
        bus_categories_id: vehicle.bus_categories_id,
      });
    });
    return vehiclelist;
  }

  function checkVehicleLicence() {
    let returnValue = true;
    getNewVehicles().every((vehicle) => {
      if (vehicle.license == "") {
        addNewGlobalWarningInformation(
          "Veuillez entrer l'immatriculation du véhicule"
        );
        returnValue = false;
        return false;
      }
      return true;
    });
    return returnValue;
  }

  async function addTransporter() {
    if (newName() == "") {
      addNewGlobalWarningInformation("Veuillez entrer un nom");
      return;
    }
    if (getNewVehicles().length <= 0) {
      addNewGlobalWarningInformation("Veuillez ajouter au moins un véhicule");
      return;
    }
    if (!checkVehicleLicence()) return;
    enableSpinningWheel();
    await TransporterService.create({
      name: newName(),
      type: idToType(Number(newType())),
      allotment_id: Number(props.allotment_id),
      vehicles: setTransporterVehicles(),
    });
    disableSpinningWheel();
    addNewGlobalSuccessInformation("Transporteur créé");
    resetChanges();
  }

  function onNameChange(name: string) {
    setNewName(name);
  }

  function onTypeChange(type: string) {
    setNewType(type);
  }

  function resetChanges() {
    setNewName("");
    setNewType("");
    setNewVehicles([]);
    setIsTransporterAddOpen(false);
  }

  return (
    <div class="p-10">
      <div>
        <Button
          label="Ajouter Transporteur"
          onClick={() => setIsTransporterAddOpen(true)}
        />
      </div>
      <Table>
        <TransporterTableHeader />
        <TableContent>
          <For each={getTransporter()}>
            {(item) => <TransporterTableLine transporterItem={item} />}
          </For>
        </TableContent>
      </Table>
      <Show when={isTransporterAddOpen()}>
        <TransporterAddMenu
          name={newName()}
          cancel={resetChanges}
          nameChange={onNameChange}
          submit={addTransporter}
          type={newType()}
          typeChange={onTypeChange}
        />
      </Show>
    </div>
  );
}
