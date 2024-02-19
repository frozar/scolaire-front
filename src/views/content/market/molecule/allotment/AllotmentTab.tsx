import { AllotmentService } from "../../../../../_services/allotment.service";
import Button from "../../../../../component/atom/Button";
import {
  addNewUserInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../../type";
import { AllotmentTable } from "../../../allotment/organism/AllotmentTable";
import "./AllotmentTab.css";

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

  return (
    <div class="allotment-tab-container">
      <Button label="Ajouter" onClick={createAllotment} />
      <AllotmentTable />
    </div>
  );
}
