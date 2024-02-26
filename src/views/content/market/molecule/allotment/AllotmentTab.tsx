import { Show, createSignal } from "solid-js";
import { AllotmentService } from "../../../../../_services/allotment.service";
import { TransporterService } from "../../../../../_services/transporter.service";
import Button from "../../../../../component/atom/Button";
import {
  addNewUserInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../../type";
import { getAllTransporter } from "../../../allotment/molecule/TransporterTable";
import {
  AllotmentType,
  getAllotment,
} from "../../../allotment/organism/Allotment";
import { AllotmentTable } from "../../../allotment/organism/AllotmentTable";
import "./AllotmentTab.css";
import { AllotmentTabTopButtons } from "./AllotmentTabTopButtons";

export const [isAllotmentEdited, setIsAllotmentEdited] = createSignal(false);
export const [initialAllotment, setInitialAllotment] = createSignal<
  AllotmentType[]
>([]);

export function AllotmentTab() {
  async function createAllotment() {
    enableSpinningWheel();
    await AllotmentService.create({ name: "newAllotment", color: "#ffffff" });
    disableSpinningWheel();
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Allotissement créé",
    });
  }

  function cancelChanges() {
    setIsAllotmentEdited(false);
  }

  async function updateAllAllotment() {
    enableSpinningWheel();
    for (let i = 0; i < getAllotment().length; i++) {
      await AllotmentService.update({
        id: getAllotment()[i].id,
        color: getAllotment()[i].color,
        name: getAllotment()[i].name,
      });
    }
    for (let i = 0; i < getAllTransporter().length; i++) {
      await TransporterService.update({
        id: getAllTransporter()[i].id,
        allotment_id: getAllTransporter()[i].allotment_id,
        name: getAllTransporter()[i].name,
        type: getAllTransporter()[i].type,
        vehicles: getAllTransporter()[i].vehicles,
      });
    }
    disableSpinningWheel();
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Modifications appliquées",
    });
  }

  return (
    <div class="allotment-tab-container">
      <Button label="Ajouter" onClick={createAllotment} />
      <Show when={isAllotmentEdited()}>
        <AllotmentTabTopButtons
          cancel={cancelChanges}
          submit={updateAllAllotment}
        />
      </Show>
      <AllotmentTable />
    </div>
  );
}
