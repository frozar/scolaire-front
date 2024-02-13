import { Show, createSignal } from "solid-js";
import { AllotmentService } from "../../../../_services/allotment.service";
import CheckIcon from "../../../../icons/CheckIcon";
import { CircleCrossIcon } from "../../../../icons/CircleCrossIcon";
import { addNewUserInformation } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { TableElement } from "../../bus/atom/TableElement";
import { TableElementInput } from "../../bus/atom/TableElementInput";
import { AllotmentType } from "../organism/Allotment";
import { TableLineDisplayData } from "./TableLineDisplayData";

interface TableLineProps {
  allotmentItem: AllotmentType;
}

export function TableLine(props: TableLineProps) {
  const [isInEditMode, setisInEditMode] = createSignal(false);

  // eslint-disable-next-line solid/reactivity
  const [getName, setName] = createSignal(props.allotmentItem.name);

  function toggleEditMode() {
    setisInEditMode(!isInEditMode());
  }

  async function updateButton() {
    await AllotmentService.update({
      id: props.allotmentItem.id,
      name: getName(),
    });
    toggleEditMode();
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Les modifications ont bien été apportées",
    });
  }

  async function deleteAllotment() {
    await AllotmentService.deleteAllotment(props.allotmentItem.id);
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "L'allotissement a bien été supprimé",
    });
    toggleEditMode();
  }

  function onNameInputChanged(value: string) {
    setName(value);
  }

  return (
    <Show
      when={isInEditMode()}
      fallback={
        <TableLineDisplayData
          name={props.allotmentItem.name}
          toggleEditFunction={toggleEditMode}
          deleteFunction={deleteAllotment}
        />
      }
    >
      <tr class="tableRowEditing">
        <TableElementInput
          defaultValue={getName()}
          onInputFunction={onNameInputChanged}
          placeholder="Entrer un nom"
        />
        <TableElement text="-" />
        <TableElement text="-" />
        <td class="actionButtonContainer">
          <ButtonIcon icon={<CheckIcon />} onClick={updateButton} />
          <ButtonIcon icon={<CircleCrossIcon />} onClick={deleteAllotment} />
        </td>
      </tr>
    </Show>
  );
}
