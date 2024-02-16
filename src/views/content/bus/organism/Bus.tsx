import { createSignal } from "solid-js";
import Button from "../../../../component/atom/Button";
import PageTitle from "../../../../component/atom/PageTitle";
import { BusTable } from "./BusTable";

export type BusCategoryType = {
  id?: number;
  category: string;
  capacity: number;
  name: string;
};

export const [getBus, setBus] = createSignal<BusCategoryType[]>([]);

export const [isAddLineHidden, setIsAddLineHidden] = createSignal(true);

function showAddLine() {
  if (!isAddLineHidden()) {
    return;
  }
  setIsAddLineHidden(false);
}

export function Bus() {
  return (
    <div class="busPageLayout">
      <div class="busPageTopItems">
        <PageTitle title="Gestion des Bus" />
        <Button label="Ajouter" onClick={showAddLine} />
      </div>
      <BusTable busList={getBus()} />
    </div>
  );
}
