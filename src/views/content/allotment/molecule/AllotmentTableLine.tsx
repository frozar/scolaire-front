import { Show, createSignal } from "solid-js";
import { AllotmentService } from "../../../../_services/allotment.service";
import {
  addNewUserInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import { AllotmentType } from "../organism/Allotment";
import { AllotmentEditMenu } from "./AllotmentEditMenu";
import { TableLineDisplayData } from "./TableLineDisplayData";

interface AllotmentTableLineProps {
  allotmentItem: AllotmentType;
}

export function AllotmentTableLine(props: AllotmentTableLineProps) {
  const [isInEditMode, setisInEditMode] = createSignal(false);

  // eslint-disable-next-line solid/reactivity
  const [getName, setName] = createSignal(props.allotmentItem.name);

  // eslint-disable-next-line solid/reactivity
  const [getColor, setColor] = createSignal(props.allotmentItem.color);

  function toggleEditMode() {
    setisInEditMode(!isInEditMode());
  }

  async function deleteAllotment() {
    enableSpinningWheel();
    await AllotmentService.deleteAllotment(props.allotmentItem.id);
    disableSpinningWheel();
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "L'allotissement a bien été supprimé",
    });
  }

  function onNameInputChanged(value: string) {
    setName(value);
  }

  function onColorInputChanged(value: string) {
    setColor(value);
  }

  return (
    <Show
      when={isInEditMode()}
      fallback={
        <TableLineDisplayData
          name={props.allotmentItem.name}
          color={props.allotmentItem.color}
          toggleEditFunction={toggleEditMode}
          deleteFunction={deleteAllotment}
        />
      }
    >
      <td colSpan={5}>
        <AllotmentEditMenu
          id={props.allotmentItem.id}
          toggleEdit={toggleEditMode}
          color={getColor()}
          name={getName()}
          onColorInput={onColorInputChanged}
          onNameInput={onNameInputChanged}
        />
      </td>
    </Show>
  );
}
