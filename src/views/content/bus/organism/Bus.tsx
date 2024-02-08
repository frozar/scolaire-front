import { createSignal } from "solid-js";
import { BusCategoryType } from "../../../../_entities/bus.entity";
import Button from "../../../../component/atom/Button";
import PageTitle from "../../../../component/atom/PageTitle";
import { BusTable } from "./BusTable";

export const [getBus, setBus] = createSignal<BusCategoryType[]>([]);

export const [addButtonClicked, setAddButtonClicked] = createSignal(false);

function addBus() {
  const obj: BusCategoryType = {
    category: "Nom par défaut",
    capacity: 15,
    // quantity: 0,
    // trip: 0,
  };
  setAddButtonClicked(true);
  setBus((prev) => [obj, ...prev]);
}

export function Bus() {
  return (
    <div class="busPageLayout">
      <div class="busPageTopItems">
        <PageTitle title="Gestion des Bus" />
        <Button label="Ajouter" onClick={addBus} />
      </div>
      <BusTable isEditMode={addButtonClicked()} busList={getBus()} />
    </div>
  );
}
