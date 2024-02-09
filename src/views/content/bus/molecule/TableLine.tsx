import { createSignal, Show } from "solid-js";
import { BusService } from "../../../../_services/bus.service";
import CheckIcon from "../../../../icons/CheckIcon";
import { CircleCrossIcon } from "../../../../icons/CircleCrossIcon";
import { addNewUserInformation } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { TableElement } from "../atom/TableElement";
import { TableElementInput } from "../atom/TableElementInput";
import { TableElementNumberInput } from "../atom/TableElementNumberInput";
import { BusCategoryType } from "../organism/Bus";
import "./TableLine.css";
import { TableLineDisplayData } from "./TableLineDisplayData";

interface TableLineProps {
  busItem: BusCategoryType;
}

export function TableLine(props: TableLineProps) {
  const [isInEditMode, setisInEditMode] = createSignal(false);

  // eslint-disable-next-line solid/reactivity
  const [getCategory, setCategory] = createSignal(props.busItem.category);

  // eslint-disable-next-line solid/reactivity
  const [getCapacity, setCapacity] = createSignal(props.busItem.capacity);

  async function toggleEditMode() {
    setisInEditMode(!isInEditMode());
  }

  async function updateButton() {
    await BusService.update({
      id: props.busItem.id,
      category: getCategory(),
      capacity: getCapacity(),
    });
    toggleEditMode();
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Les modifications ont bien été apportées",
    });
  }

  async function deleteButton() {
    await BusService.deleteBus(props.busItem.id);
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Le bus a bien été supprimé",
    });
  }

  function cancelButton() {
    setCategory(props.busItem.category);
    setCapacity(props.busItem.capacity);
    toggleEditMode();
  }

  function onCategoryInputChanged(value: string) {
    setCategory(value);
  }

  return (
    <Show
      when={isInEditMode()}
      fallback={
        <TableLineDisplayData
          category={getCategory()}
          capacity={getCapacity()}
          toggleEditFunction={toggleEditMode}
          deleteFunction={deleteButton}
        />
      }
    >
      <tr class="tableRowEditing">
        <TableElementInput
          defaultValue={getCategory()}
          onInputFunction={onCategoryInputChanged}
          placeholder="Entrer le type de bus"
        />
        <TableElementNumberInput
          defaultValue={getCapacity()}
          onChangeFunction={setCapacity}
        />
        <TableElement text="-" />
        <TableElement text="-" />
        <td class="actionButtonContainer">
          <ButtonIcon icon={<CheckIcon />} onClick={updateButton} />
          <ButtonIcon icon={<CircleCrossIcon />} onClick={cancelButton} />
        </td>
      </tr>
    </Show>
  );
}
