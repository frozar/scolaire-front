import { createSignal } from "solid-js";
import { AllotmentService } from "../../../../_services/allotment.service";
import { TableData } from "../../../../component/table/atom/TableData";
import { TableDataChilds } from "../../../../component/table/molecule/TableDataChilds";
import CheckIcon from "../../../../icons/CheckIcon";
import { CircleCrossIcon } from "../../../../icons/CircleCrossIcon";
import { addNewUserInformation } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { TableElementInput } from "../../bus/atom/TableElementInput";
import { TableElementColorPicker } from "../atom/TableElementColorPicker";
import { isNewLineHidden, setIsNewLineHidden } from "../organism/Allotment";
import "./TableLine.css";

export function AddTableLine() {
  const [getName, setName] = createSignal("defaultName");
  const [getColor, setColor] = createSignal("#ffffff");

  async function createNewAllotment() {
    await AllotmentService.create({ name: getName(), color: getColor() });
    setIsNewLineHidden(true);
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Allotissement créé",
    });
    resetDefaultValues();
  }

  function resetDefaultValues() {
    setName("defaultName");
    setColor("#ffffff");
  }

  function cancelButton() {
    resetDefaultValues();
    setIsNewLineHidden(true);
  }

  function onNameInputChanged(value: string) {
    setName(value);
  }

  function onColorInputChanged(color: string) {
    setColor(color);
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
      <TableElementColorPicker
        defaultColor={getColor()}
        onInputFunction={onColorInputChanged}
      />
      <TableData text="-" />
      <TableData text="-" />
      <TableDataChilds>
        <ButtonIcon icon={<CheckIcon />} onClick={createNewAllotment} />
        <ButtonIcon icon={<CircleCrossIcon />} onClick={cancelButton} />
      </TableDataChilds>
    </tr>
  );
}
