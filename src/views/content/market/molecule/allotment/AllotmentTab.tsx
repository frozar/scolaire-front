import { Show, createSignal, onMount } from "solid-js";
import {
  AllotmentCostType,
  AllotmentType,
} from "../../../../../_entities/allotment.entity";
import { AllotmentService } from "../../../../../_services/allotment.service";
import { TransporterService } from "../../../../../_services/transporter.service";
import { AllotmentStore } from "../../../../../_stores/allotment.store";
import Button from "../../../../../component/atom/Button";
import {
  addNewGlobalSuccessInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { setIsAllotmentMenuOpen } from "../../../allotment/molecule/AllotmentTableLine";
import { AllotmentTable } from "../../../allotment/organism/AllotmentTable";
import { AllotmentAddMenu } from "./AllotmentAddMenu";
import "./AllotmentTab.css";
import { AllotmentTabTopButtons } from "./AllotmentTabTopButtons";

export const [isAllotmentEdited, setIsAllotmentEdited] = createSignal(false);
export const [transporterToDelete, setTranspoterToDelete] = createSignal<
  number[]
>([]);

export function AllotmentTab() {
  const [isAddMenuOpen, setIsAddMenuOpen] = createSignal(false);
  const [allotments, setAllotments] = createSignal<AllotmentType[]>([]);
  const [newName, setNewName] = createSignal("");
  const [newColor, setNewColor] = createSignal("#ffffff");
  const [newCosts, setNewCosts] = createSignal<AllotmentCostType[]>([]);

  function nameChanged(name: string) {
    setNewName(name);
  }

  function colorChanged(color: string) {
    setNewColor(color);
  }

  function costChanged(cost: AllotmentCostType[]) {
    setNewCosts(cost);
  }

  onMount(() => {
    setAllotments(AllotmentStore.get());
    setTranspoterToDelete([]);
  });

  function cancelCreate() {
    setIsAddMenuOpen(false);
    setNewName("");
    setNewColor("#ffffff");
  }

  async function createAllotment() {
    enableSpinningWheel();
    const newAllotment = await AllotmentService.create({
      name: newName(),
      color: newColor(),
      vehicleCost: newCosts(),
      transporters: [],
    });
    AllotmentStore.add(newAllotment);
    setAllotments(AllotmentStore.get());
    disableSpinningWheel();
    addNewGlobalSuccessInformation("Allotissement créé");
    setIsAddMenuOpen(false);
  }

  function cancelChanges() {
    setAllotments([]);
    setAllotments(AllotmentStore.get());
    setIsAddMenuOpen(false);
    setIsAllotmentEdited(false);
    setTranspoterToDelete([]);
  }

  async function updateAllAllotment() {
    enableSpinningWheel();
    const output: AllotmentType[] = [];
    const tmpList = allotments();
    if (transporterToDelete().length > 0) await deleteTransporter();
    for (const item of tmpList) {
      if (item.transporters.length > 0) await updateTransporter(item);
      const updated = await AllotmentService.update(item);
      output.push(updated);
    }
    AllotmentStore.set(output);
    setIsAllotmentEdited(false);
    setIsAllotmentMenuOpen(false);
    setTranspoterToDelete([]);
    addNewGlobalSuccessInformation("Modifications appliquées");
    disableSpinningWheel();
  }

  async function updateTransporter(allotment: AllotmentType) {
    const tmpList = allotment.transporters;
    for (const item of tmpList) {
      if (item.name == "" || item.type == "") return;
      if (item.id == 0) return await TransporterService.create(item);
      await TransporterService.update(item);
    }
  }

  async function deleteTransporter() {
    const tmpList = transporterToDelete();
    for (const id of tmpList) {
      await TransporterService.deleteTransporter(id);
    }
  }

  return (
    <div class="allotment-tab-container">
      <Button
        label="Ajouter Allotissement"
        onClick={() => setIsAddMenuOpen(true)}
      />
      <Show when={isAllotmentEdited()}>
        <AllotmentTabTopButtons
          cancel={cancelChanges}
          submit={updateAllAllotment}
        />
      </Show>
      <AllotmentTable
        allotments={allotments()}
        allotmentsSetter={setAllotments}
      />
      <Show when={isAddMenuOpen()}>
        <AllotmentAddMenu
          defaultColor={newColor()}
          defaultName={newName()}
          colorChange={colorChanged}
          costchange={costChanged}
          nameChange={nameChanged}
          submit={createAllotment}
          cancel={cancelCreate}
        />
      </Show>
    </div>
  );
}
