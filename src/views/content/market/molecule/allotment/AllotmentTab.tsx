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
import { setIsAllotmentMenuOpen } from "../../../allotment/molecule/AllotmentTableLine";
import {
  getAllTransporter,
  setAllTransporter,
} from "../../../allotment/molecule/TransporterTable";
import {
  getAllotment,
  setAllotment,
} from "../../../allotment/organism/Allotment";
import { AllotmentTable } from "../../../allotment/organism/AllotmentTable";
import "./AllotmentTab.css";
import { AllotmentTabTopButtons } from "./AllotmentTabTopButtons";

export const [isAllotmentEdited, setIsAllotmentEdited] = createSignal(false);

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
    setAllotment(getAllotment());
    setAllTransporter(getAllTransporter());
    setIsAllotmentEdited(false);
  }

  async function updateAllAllotment() {
    enableSpinningWheel();
    getAllotment().forEach(async (element) => {
      await AllotmentService.update({
        id: element.id,
        color: element.color,
        name: element.name,
      });
    });
    getAllTransporter().forEach(async (element) => {
      await TransporterService.update({
        id: element.id,
        allotment_id: element.allotment_id,
        name: element.name,
        type: element.type,
        vehicles: element.vehicles,
      });
    });
    disableSpinningWheel();
    setIsAllotmentEdited(false);
    setIsAllotmentMenuOpen(false);
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Modifications appliquées",
    });
  }

  return (
    <div class="allotment-tab-container">
      <Button label="Ajouter Allotissement" onClick={createAllotment} />
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
