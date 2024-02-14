import { createSignal } from "solid-js";
import Button from "../../../../component/atom/Button";
import PageTitle from "../../../../component/atom/PageTitle";
import "./Allotment.css";
import { AllotmentTable } from "./AllotmentTable";

export type AllotmentType = {
  id?: number;
  name: string;
  color: string;
};

export const [getAllotment, setAllotment] = createSignal<AllotmentType[]>([]);

export const [isNewLineHidden, setIsNewLineHidden] = createSignal(true);

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
      <AllotmentTable allotmentList={getAllotment()} />
    </div>
  );
}
