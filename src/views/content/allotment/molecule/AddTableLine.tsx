import { createSignal } from "solid-js";
import CheckIcon from "../../../../icons/CheckIcon";
import { CircleCrossIcon } from "../../../../icons/CircleCrossIcon";
import { addNewUserInformation } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { TableElement } from "../../bus/atom/TableElement";
import { TableElementInput } from "../../bus/atom/TableElementInput";
import { isNewLineHidden, setIsNewLineHidden } from "../organism/Allotment";
import "./TableLine.css";

export function AddTableLine() {
  const [getName, setName] = createSignal("defaultName");

  function createNewAllotment() {
    setIsNewLineHidden(true);
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Allotissement créé",
    });
    setName("defaultName");
  }

  function cancelButton() {
    setName("defaultName");
    setIsNewLineHidden(true);
  }

  function onNameInputChanged(value: string) {
    setName(value);
  }
  return (
    <tr
      classList={{ tableRowEditing: !isNewLineHidden() }}
      hidden={isNewLineHidden()}
    >
      <TableElementInput
        defaultValue={getName()}
        placeholder="Entrer un nom"
        onInputFunction={onNameInputChanged}
      />
      <TableElement text="-" />
      <TableElement text="-" />
      <td class="actionButtonContainer">
        <ButtonIcon icon={<CheckIcon />} onClick={createNewAllotment} />
        <ButtonIcon icon={<CircleCrossIcon />} onClick={cancelButton} />
      </td>
    </tr>
  );
}
