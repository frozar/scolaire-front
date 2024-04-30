import { Show, createSignal, onMount } from "solid-js";
import { AllotmentType } from "../../../../../_entities/allotment.entity";
import { AllotmentService } from "../../../../../_services/allotment.service";
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

export function AllotmentTab() {
  const [isAddMenuOpen, setIsAddMenuOpen] = createSignal(false);
  const [allotments, setAllotments] = createSignal<AllotmentType[]>([]);
  const [newName, setNewName] = createSignal("");
  const [newColor, setNewColor] = createSignal("#ffffff");

  function nameChanged(name: string) {
    setNewName(name);
  }

  function colorChanged(color: string) {
    setNewColor(color);
  }

  onMount(() => {
    setAllotments(AllotmentStore.get());
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
      vehicleCost: [],
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
  }

  async function updateAllAllotment() {
    enableSpinningWheel();
    const output: AllotmentType[] = [];
    const tmpList = allotments();
    for (const item of tmpList) {
      const updated = await AllotmentService.update(item);
      output.push(updated);
    }
    AllotmentStore.set(output);
    // getAllTransporter().forEach(async (element) => {
    //   await TransporterService.update({
    //     id: element.id,
    //     allotment_id: element.allotment_id,
    //     name: element.name,
    //     type: element.type,
    //     vehicles: element.vehicles,
    //   });
    // });
    setIsAllotmentEdited(false);
    setIsAllotmentMenuOpen(false);
    addNewGlobalSuccessInformation("Modifications appliquées");
    disableSpinningWheel();
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
          nameChange={nameChanged}
          submit={createAllotment}
          cancel={cancelCreate}
        />
      </Show>
    </div>
  );
}
