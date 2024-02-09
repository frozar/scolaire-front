import { createSignal } from "solid-js";
import { BusService } from "../../../../_services/bus.service";
import CheckIcon from "../../../../icons/CheckIcon";
import { CircleCrossIcon } from "../../../../icons/CircleCrossIcon";
import { addNewUserInformation } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { TableElement } from "../atom/TableElement";
import { TableElementInput } from "../atom/TableElementInput";
import { TableElementNumberInput } from "../atom/TableElementNumberInput";
import { isAddLineHidden, setIsAddLineHidden } from "../organism/Bus";
import "./TableLine.css";

export function AddTableLine() {
  const [getCategory, setCategory] = createSignal("defaultBus");
  const [getCapacity, setCapacity] = createSignal(10);

  function onCategoryInputChanged(value: string) {
    setCategory(value);
  }

  function resetDefaultValues(): void {
    setCategory("defaultBus");
    setCapacity(10);
  }

  async function createNewBus() {
    await BusService.create({
      category: getCategory(),
      capacity: getCapacity(),
    });
    setIsAddLineHidden(true);
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Le bus " + getCategory() + " a bien été créé",
    });
    resetDefaultValues();
  }

  function cancelButton() {
    resetDefaultValues();
    setIsAddLineHidden(true);
  }

  return (
    <tr
      classList={{ tableRowEditing: !isAddLineHidden() }}
      hidden={isAddLineHidden()}
    >
      <TableElementInput
        placeholder="Entrer le type de bus"
        onInputFunction={onCategoryInputChanged}
        defaultValue={getCategory()}
      />
      <TableElementNumberInput
        defaultValue={getCapacity()}
        onChangeFunction={setCapacity}
      />
      <TableElement text="-" />
      <TableElement text="-" />
      <td class="actionButtonContainer">
        <ButtonIcon icon={<CheckIcon />} onClick={createNewBus} />
        <ButtonIcon icon={<CircleCrossIcon />} onClick={cancelButton} />
      </td>
    </tr>
  );
}
