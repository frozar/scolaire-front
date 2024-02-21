import { AllotmentService } from "../../../../_services/allotment.service";
import {
  addNewUserInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import { AllotmentEditHeader } from "../atom/AllotmentEditHeader";
import { AllotmentEditContent } from "./AllotmentEditContent";

interface AllotmentEditMenuProps {
  id?: number;
  name: string;
  color: string;
  toggleEdit: () => void;
  onNameInput: (name: string) => void;
  onColorInput: (color: string) => void;
}

export function AllotmentEditMenu(props: AllotmentEditMenuProps) {
  async function updateAllotment() {
    enableSpinningWheel();
    await AllotmentService.update({
      id: props.id,
      name: props.name,
      color: props.color,
    });
    disableSpinningWheel();
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Les modifications ont bien été apportées",
    });
    props.toggleEdit();
  }

  return (
    <div>
      <AllotmentEditHeader title={props.name} />
      <AllotmentEditContent
        allotment_id={props.id}
        color={props.color}
        name={props.name}
        onColorInput={props.onColorInput}
        onNameInput={props.onNameInput}
        cancelFunction={props.toggleEdit}
        submitFunction={updateAllotment}
      />
    </div>
  );
}
