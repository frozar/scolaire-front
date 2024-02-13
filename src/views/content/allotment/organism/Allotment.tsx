import { createSignal } from "solid-js";
import Button from "../../../../component/atom/Button";
import PageTitle from "../../../../component/atom/PageTitle";
import "./Allotment.css";
import { AllotmentTable } from "./AllotmentTable";

export type AllotmentType = {
  id?: number;
  name: string;
};

export const [isNewLineHidden, setIsNewLineHidden] = createSignal(true);

const [fakeData] = createSignal<AllotmentType[]>([
  { id: 1, name: "Lot 1" },
  { id: 2, name: "Lot 2" },
  { id: 3, name: "Lot 3" },
  { id: 4, name: "Lot 4" },
]);

function showNewLine() {
  if (!isNewLineHidden()) {
    return;
  }
  setIsNewLineHidden(false);
}

export function Allotment() {
  return (
    <div class="allotmentPageLayout">
      <div class="allotmentPageTopItems">
        <PageTitle title="Allotissement" />
        <Button label="Ajouter" onClick={showNewLine} />
      </div>
      <AllotmentTable allotmentList={fakeData()} />
    </div>
  );
}
